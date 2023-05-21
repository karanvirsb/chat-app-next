import makeDb, { clearDb, closeDb } from "@/server/__test__/fixures/db";
import makeFakeGroup from "@/server/__test__/fixures/group";
import userTests from "@/server/__test__/functions/user";

import { moderateName } from "../../../Utilities/moderateText";
import makeUsersDb from "../../user/data-access/users-db";
import makeGroupDb from "../data-access/group-db";
import makeAddGroup from "./addGroup";
import makeAddUserToGroup from "./addUserToGroup";

const handleModeration = async (name: string) => {
  return await moderateName(name);
};

describe("Adding user to group use case", () => {
  const groupDb = makeGroupDb({ makeDb });
  const addGroup = makeAddGroup({ groupDb, handleModeration });
  const addUserToGroup = makeAddUserToGroup({ groupDb });

  beforeAll(async () => {
    // creating user if it does not exist
    const userDb = makeUsersDb({ makeDb });
    const foundUser = await userDb.findById({
      id: "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc",
    });
    const firstUser = userTests.addTestUserToDB({
      userId: "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc",
    });
    const secondUser = userTests.addTestUserToDB({
      userId: "3443c648-3323-4d6b-8830-c8a1b66a043a",
    });
  });

  afterAll(async () => {
    await clearDb("groupt");
    await clearDb('"groupUsers"');
    await userTests.deleteTestUser({
      userId: "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc",
    });
    await userTests.deleteTestUser({
      userId: "3443c648-3323-4d6b-8830-c8a1b66a043a",
    });
    await closeDb();
  });

  test("SUCCESS: Adding user to group", async () => {
    const group = await makeFakeGroup();
    const res = await addGroup(group, "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc");

    const addedUser = await addUserToGroup(
      group.groupId,
      "3443c648-3323-4d6b-8830-c8a1b66a043a"
    );
    if (addedUser.success)
      expect(addedUser.data?.uId).toBe("3443c648-3323-4d6b-8830-c8a1b66a043a");
  });

  test("ERROR: Adding user to group but no group id", async () => {
    const group = await makeFakeGroup();
    const addedGroup = await addGroup(
      group,
      "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
    );
    try {
      const groupErr = await addUserToGroup(
        "",
        "3443c648-3323-4d6b-8830-c8a1b66a043a"
      );
    } catch (err) {
      if (err instanceof Error)
        expect(err.message).toBe("Group Id needs to be supplied");
    }
  });

  test("ERROR: Adding user to group but no user id is provided", async () => {
    const group = await makeFakeGroup();
    const addedGroup = await addGroup(
      group,
      "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
    );
    try {
      const groupErr = await addUserToGroup(group.groupId, "");
    } catch (err) {
      if (err instanceof Error)
        expect(err.message).toBe("User Id needs to be supplied");
    }
  });
});
