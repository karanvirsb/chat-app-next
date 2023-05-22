import makeDb, { closeDb } from "@/server/__test__/fixures/db";
import makeFakeGroup from "@/server/__test__/fixures/group";
import groupTests from "@/server/__test__/functions/group";
import userTests from "@/server/__test__/functions/user";

import { moderateName } from "../../../Utilities/moderateText";
import makeGroupDb from "../data-access/group-db";
import { IGroup } from "../group";
import makeAddGroup from "./addGroup";

const handleModeration = async (name: string) => {
  return await moderateName(name);
};

describe("Adding group use case", () => {
  const groupDb = makeGroupDb({ makeDb });
  const addGroup = makeAddGroup({ groupDb, handleModeration });
  let group: IGroup;
  beforeAll(async () => {
    // creating user if it does not exist
    await userTests.addTestUserToDB({
      userId: "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc",
    });
    // if user does not exist creat
  });
  beforeEach(async () => {
    group = await makeFakeGroup();
  });
  afterEach(async () => {
    await groupTests.deleteTestGroup({
      groupId: group.groupId,
      userId: "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc",
    });
  });

  afterAll(async () => {
    await userTests.deleteTestUser({
      userId: "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc",
    });
    groupTests.deleteTestGroup({
      groupId: group.groupId,
      userId: "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc",
    });
    await closeDb();
  });

  test("Successfully insert group use case", async () => {
    const res = await addGroup(group, "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc");
    console.log(res, group);
    if (res.success) {
      expect(res.data?.groupName).toBe(group.groupName);
    }
  });

  test("Duplicate group insert", async () => {
    const res = await addGroup(group, "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc");
    if (res.success) {
      const err = await addGroup(group, "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc");
      if (!err.success) expect(err.error).toBe("Group already exists");
    }
  });

  test("Group name contains profanity", async () => {
    group["groupName"] = "bullshit";
    try {
      // TODO will not throw error anymore
      await addGroup(group, "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc");
    } catch (error) {
      if (error instanceof Error)
        expect(error.message).toBe("Group name contains profanity");
    }
  });
});
