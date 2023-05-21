import makeDb, { clearDb, closeDb } from "@/server/__test__/fixures/db";
import makeFakeGroup from "@/server/__test__/fixures/group";
import userTests from "@/server/__test__/functions/user";

import { moderateName } from "../../../Utilities/moderateText";
import makeGroupDb from "../data-access/group-db";
import makeAddGroup from "./addGroup";
import makeDeleteGroup from "./deleteGroup";

const handleModeration = async (name: string) => {
  return await moderateName(name);
};

describe("Deleting group use case", () => {
  const groupDb = makeGroupDb({ makeDb });
  const addGroup = makeAddGroup({ groupDb, handleModeration });
  const deleteGroup = makeDeleteGroup({ groupDb });
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
  test("SUCCESS: Delete group use case", async () => {
    const group = await makeFakeGroup();
    const res = await addGroup(group, "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc");

    const removedGroup = await deleteGroup(group.groupId);
    if (removedGroup.success)
      expect(removedGroup.data?.groupName).toBe(group.groupName);
  });

  test("ERROR: remove group but missing id", async () => {
    const group = await makeFakeGroup();
    const addedGroup = await addGroup(
      group,
      "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
    );
    try {
      const groupErr = await deleteGroup("");
    } catch (err) {
      if (err instanceof Error)
        expect(err.message).toBe("Group Id needs to be supplied");
    }
  });
});
