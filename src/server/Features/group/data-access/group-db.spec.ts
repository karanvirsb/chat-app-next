import makeDb, { closeDb } from "@/server/__test__/fixures/db";
import makeFakerGroup from "@/server/__test__/fixures/group";
import userTests from "@/server/__test__/functions/user";

import inviteCodeGenerator from "../../../Utilities/inviteCodeGenerator";
import makeGroupDb, { IMakeGroupDb } from "./group-db";

describe("Group databse access", () => {
  let GroupDb: IMakeGroupDb["returnType"];

  beforeAll(async () => {
    jest.setTimeout(30000);
    GroupDb = makeGroupDb({ makeDb });

    const addedUser = userTests.addTestUserToDB({
      userId: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
    });
  });

  afterAll(async () => {
    // TODO
    // // TODO await clearDb("groupt");
    // // TODO await clearDb('"groupUsers"');
    await userTests.deleteTestUser({
      userId: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
    });
    await closeDb();
  });
  test("inserted group correctly", async () => {
    const group = await makeFakerGroup();

    const res = await GroupDb.createGroup(
      group,
      "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
    );
    if (res.success) expect(res.data?.groupId).toBe(group.groupId);
  });

  test("Find group by id", async () => {
    const group = await makeFakerGroup();

    const res = await GroupDb.createGroup(
      group,
      "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
    );

    const foundGroup = await GroupDb.findById(group.groupId);
    expect(foundGroup.data?.groupName).toBe(group.groupName);
  });

  test("updating group name", async () => {
    const group = await makeFakerGroup();

    const res = await GroupDb.createGroup(
      group,
      "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
    );

    const updatedGroup = await GroupDb.updateGroupName(group.groupId, "Coders");

    expect(updatedGroup.data?.groupName).toBe("Coders");
  });

  test("deleting group", async () => {
    const group = await makeFakerGroup();

    const res = await GroupDb.createGroup(
      group,
      "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
    );

    const deletedGroup = await GroupDb.removeGroup(group.groupId);
    if (deletedGroup.success)
      expect(deletedGroup.data?.groupName).toBe(group.groupName);
  });

  test("updating group invite code", async () => {
    const group = await makeFakerGroup();

    const res = await GroupDb.createGroup(
      group,
      "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
    );
    const newCode = inviteCodeGenerator.makeInviteCode();
    const updatedGroup = await GroupDb.updateInviteCode(group.groupId, newCode);

    expect(updatedGroup.data?.inviteCode).toBe(newCode);
  });

  test("Find group by invite code", async () => {
    const group = await makeFakerGroup();

    const res = await GroupDb.createGroup(
      group,
      "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
    );

    const foundGroup = await GroupDb.findByInviteCode(group.inviteCode);
    expect(foundGroup.data?.groupName).toBe(group.groupName);
  });

  test("Find users of group", async () => {
    const group = await makeFakerGroup();

    const res = await GroupDb.createGroup(
      group,
      "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
    );

    const users = await GroupDb.findUsersByGroupId(group.groupId);
    if (users.data)
      expect(users.data[0].userId).toBe("5c0fc896-1af1-4c26-b917-550ac5eefa9e");
  });

  test("Adding user to group", async () => {
    const group = await makeFakerGroup();

    const res = await GroupDb.createGroup(
      group,
      "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
    );

    const addedUser = await GroupDb.addUserToGroup(
      group.groupId,
      "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc",
      ["2001"]
    );
    if (addedUser.success)
      expect(addedUser.data?.uId).toBe("cc7d98b5-6f88-4ca5-87e2-435d1546f1fc");
  });

  test("Remove user from group", async () => {
    const group = await makeFakerGroup();

    const res = await GroupDb.createGroup(
      group,
      "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
    );

    const addedUser = await GroupDb.addUserToGroup(
      group.groupId,
      "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc",
      ["2001"]
    );

    const deletedUser = await GroupDb.removeUserFromGroup(
      group.groupId,
      "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
    );

    expect(deletedUser.data?.uId).toBe("cc7d98b5-6f88-4ca5-87e2-435d1546f1fc");
  });
});
