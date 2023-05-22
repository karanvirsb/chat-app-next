import { closeDb } from "@/server/__test__/fixures/db";
import makeFakeGroup from "@/server/__test__/fixures/group";
import groupTests from "@/server/__test__/functions/group";
import userTests from "@/server/__test__/functions/user";

import inviteCodeGenerator from "../../../Utilities/inviteCodeGenerator";
import { IGroup } from "../group";
import { IMakeGroupDb } from "./group-db";

describe("Group databse access", () => {
  let GroupDb: IMakeGroupDb["returnType"];

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
    await groupTests.deleteTestGroup({
      groupId: group.groupId,
      userId: "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc",
    });
    await closeDb();
  });

  test("inserted group correctly", async () => {
    const res = await GroupDb.createGroup(
      group,
      "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
    );
    if (res.success) expect(res.data?.groupId).toBe(group.groupId);
  });

  test("Find group by id", async () => {
    await GroupDb.createGroup(group, "5c0fc896-1af1-4c26-b917-550ac5eefa9e");

    const foundGroup = await GroupDb.findById(group.groupId);
    expect(foundGroup.data?.groupName).toBe(group.groupName);
  });

  test("updating group name", async () => {
    await GroupDb.createGroup(group, "5c0fc896-1af1-4c26-b917-550ac5eefa9e");

    const updatedGroup = await GroupDb.updateGroupName(group.groupId, "Coders");

    expect(updatedGroup.data?.groupName).toBe("Coders");
  });

  test("deleting group", async () => {
    await GroupDb.createGroup(group, "5c0fc896-1af1-4c26-b917-550ac5eefa9e");

    const deletedGroup = await GroupDb.removeGroup(group.groupId);
    if (deletedGroup.success)
      expect(deletedGroup.data?.groupName).toBe(group.groupName);
  });

  test("updating group invite code", async () => {
    await GroupDb.createGroup(group, "5c0fc896-1af1-4c26-b917-550ac5eefa9e");
    const newCode = inviteCodeGenerator.makeInviteCode();
    const updatedGroup = await GroupDb.updateInviteCode(group.groupId, newCode);

    expect(updatedGroup.data?.inviteCode).toBe(newCode);
  });

  test("Find group by invite code", async () => {
    await GroupDb.createGroup(group, "5c0fc896-1af1-4c26-b917-550ac5eefa9e");

    const foundGroup = await GroupDb.findByInviteCode(group.inviteCode);
    expect(foundGroup.data?.groupName).toBe(group.groupName);
  });

  test("Find users of group", async () => {
    await GroupDb.createGroup(group, "5c0fc896-1af1-4c26-b917-550ac5eefa9e");

    const users = await GroupDb.findUsersByGroupId(group.groupId);
    if (users.data)
      expect(users.data[0].userId).toBe("5c0fc896-1af1-4c26-b917-550ac5eefa9e");
  });

  test("Adding user to group", async () => {
    await GroupDb.createGroup(group, "5c0fc896-1af1-4c26-b917-550ac5eefa9e");

    const addedUser = await GroupDb.addUserToGroup(
      group.groupId,
      "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc",
      ["2001"]
    );
    if (addedUser.success)
      expect(addedUser.data?.uId).toBe("cc7d98b5-6f88-4ca5-87e2-435d1546f1fc");
  });

  test("Remove user from group", async () => {
    await GroupDb.createGroup(group, "5c0fc896-1af1-4c26-b917-550ac5eefa9e");

    await GroupDb.addUserToGroup(
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
