import makeDb, { clearDb, closeDb } from "@/server/__test__/fixures/db";
import makeFakeGroup from "@/server/__test__/fixures/group";
import userTests from "@/server/__test__/functions/user";

import { moderateName } from "../../../Utilities/moderateText";
import makeGroupDb from "../data-access/group-db";
import makeAddGroup from "./addGroup";
import makeRemoveUserFromGroup from "./removeUserFromGroup";

const handleModeration = async (name: string) => {
  return await moderateName(name);
};

describe("Removing user from a group use case", () => {
  jest.setTimeout(15000);
  const groupDb = makeGroupDb({ makeDb });
  const addGroup = makeAddGroup({ groupDb, handleModeration });
  const removeUserFromGroup = makeRemoveUserFromGroup({ groupDb });

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

  test("SUCCESS: remove user from group", async () => {
    const group = await makeFakeGroup();
    const res = await addGroup(group, "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc");

    const removedUser = await removeUserFromGroup(
      group.groupId,
      "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
    );

    expect(removedUser.data?.uId).toBe("cc7d98b5-6f88-4ca5-87e2-435d1546f1fc");
  });

  test("ERROR: removing user from a group but no group id", async () => {
    const group = await makeFakeGroup();
    const addedGroup = await addGroup(
      group,
      "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
    );
    try {
      const groupErr = await removeUserFromGroup(
        "",
        "3443c648-3323-4d6b-8830-c8a1b66a043a"
      );
    } catch (err) {
      if (err instanceof Error)
        expect(err.message).toBe("Group Id needs to be supplied");
    }
  });

  test("ERROR: removing user from a group but no user id is provided", async () => {
    const group = await makeFakeGroup();
    const addedGroup = await addGroup(
      group,
      "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
    );
    try {
      const groupErr = await removeUserFromGroup(group.groupId, "");
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
        expect(err.message).toBe("User Id needs to be supplied");
      }
    }
  });
});
