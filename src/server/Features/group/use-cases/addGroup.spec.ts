import makeDb, { clearDb, closeDb } from "@/server/__test__/fixures/db";
import makeFakeGroup from "@/server/__test__/fixures/group";
import userTests from "@/server/__test__/functions/user";

import { moderateName } from "../../../Utilities/moderateText";
import makeGroupDb from "../data-access/group-db";
import makeAddGroup from "./addGroup";

const handleModeration = async (name: string) => {
  return await moderateName(name);
};

describe("Adding group use case", () => {
  const groupDb = makeGroupDb({ makeDb });
  const addGroup = makeAddGroup({ groupDb, handleModeration });

  beforeAll(async () => {
    // creating user if it does not exist
    const addedUser = userTests.addTestUserToDB({
      userId: "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc",
    });
    // if user does not exist creat
  });

  afterAll(async () => {
    // TODO
    // // TODO await clearDb("groupt");
    // // TODO await clearDb('"groupUsers"');
    await userTests.deleteTestUser({
      userId: "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc",
    });
    await closeDb();
  });

  test("Successfully insert group use case", async () => {
    const group = await makeFakeGroup();
    const res = await addGroup(group, "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc");
    console.log(res, group);
    if (res.success) {
      expect(res.data?.groupName).toBe(group.groupName);
    }
  });

  test("Duplicate group insert", async () => {
    const group = await makeFakeGroup();
    const res = await addGroup(group, "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc");
    if (res.success) {
      const err = await addGroup(group, "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc");
      if (!err.success) expect(err.error).toBe("Group already exists");
    }
  });

  test("Group name contains profanity", async () => {
    const group = await makeFakeGroup();
    group["groupName"] = "bullshit";
    try {
      const res = await addGroup(group, "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc");
    } catch (error) {
      if (error instanceof Error)
        expect(error.message).toBe("Group name contains profanity");
    }
  });
});
