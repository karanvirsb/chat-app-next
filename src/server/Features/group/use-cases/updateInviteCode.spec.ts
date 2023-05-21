import makeDb, { clearDb, closeDb } from "@/server/__test__/fixures/db";
import makeFakeGroup from "@/server/__test__/fixures/group";
import userTests from "@/server/__test__/functions/user";

import inviteCodeGenerator from "../../../Utilities/inviteCodeGenerator";
import { moderateName } from "../../../Utilities/moderateText";
import makeUsersDb from "../../user/data-access/users-db";
import makeGroupDb from "../data-access/group-db";
import makeAddGroup from "./addGroup";
import makeUpdateInviteCode from "./updateInviteCode";

const handleModeration = async (name: string) => {
  return await moderateName(name);
};

describe("Updating invite code of group use case", () => {
  jest.setTimeout(15000);
  const groupDb = makeGroupDb({ makeDb });
  const addGroup = makeAddGroup({ groupDb, handleModeration });
  const updateInviteCode = makeUpdateInviteCode({
    groupDb,
    inviteCodeGenerator,
  });

  beforeAll(async () => {
    // creating user if it does not exist
    const addedUser = userTests.addTestUserToDB({
      userId: "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc",
    });
    // if user does not exist creat
  });

  afterAll(async () => {
    // TODO
    // await clearDb("groupt");
    // await clearDb('"groupUsers"');
    await userTests.deleteTestUser({
      userId: "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc",
    });
    await closeDb();
  });

  test("SUCCESS: update invite code", async () => {
    const group = await makeFakeGroup();
    console.log(group);
    const res = await addGroup(group, "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc");

    const updatedGroup = await updateInviteCode(group.groupId);

    expect(updatedGroup.data?.inviteCode).not.toEqual(group.inviteCode);
  });

  test("ERROR: update invite code group id not given", async () => {
    const group = await makeFakeGroup();
    const addedGroup = await addGroup(
      group,
      "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
    );
    try {
      const groupErr = await updateInviteCode("");
    } catch (err) {
      if (err instanceof Error)
        expect(err.message).toBe("Group Id needs to be supplied");
    }
  });
});
