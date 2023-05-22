import makeDb, { closeDb } from "@/server/__test__/fixures/db";
import makeFakeGroup from "@/server/__test__/fixures/group";
import groupTests from "@/server/__test__/functions/group";
import userTests from "@/server/__test__/functions/user";

import { moderateName } from "../../../Utilities/moderateText";
import makeGroupDb from "../data-access/group-db";
import { IGroup } from "../group";
import makeAddGroup from "./addGroup";
import makeGetGroupById from "./getGroupbyId";
import makeGetGroupByInviteCode from "./getGroupByInviteCode";
import makeGetUsersByGroupId from "./getUsersByGroupId";

const handleModeration = async (name: string) => {
  return await moderateName(name);
};

describe("Get use cases", () => {
  const groupDb = makeGroupDb({ makeDb });
  const addGroup = makeAddGroup({ groupDb, handleModeration });
  const getGroupById = makeGetGroupById({ groupDb });
  const getGroupByInviteCode = makeGetGroupByInviteCode({ groupDb });
  const getUsersByGroupId = makeGetUsersByGroupId({ groupDb });

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

  test("Get group by id", async () => {
    await addGroup(group, "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc");

    const foundGroup = await getGroupById(group.groupId);

    expect(foundGroup.data?.groupName).toBe(group.groupName);
  });

  test("Get group by id error", async () => {
    await addGroup(group, "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc");
    try {
      await getGroupById("");
    } catch (err) {
      if (err instanceof Error)
        expect(err.message).toBe("Group Id needs to be supplied");
    }
  });

  test("Get group by invite code", async () => {
    await addGroup(group, "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc");

    const foundGroup = await getGroupByInviteCode(group.inviteCode);

    expect(foundGroup.data?.groupName).toBe(group.groupName);
  });

  test("Get group by invite code error", async () => {
    await addGroup(group, "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc");
    try {
      await getGroupByInviteCode("");
    } catch (err) {
      if (err instanceof Error)
        expect(err.message).toBe("Invite code needs to be supplied");
    }
  });

  test("Get group by invite code", async () => {
    await addGroup(group, "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc");

    const foundUsers = await getUsersByGroupId(group.inviteCode);

    if (foundUsers.data)
      expect(foundUsers.data[0].userId).toBe(
        "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
      );
  });

  test("Get group users by id error", async () => {
    await addGroup(group, "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc");
    try {
      await getUsersByGroupId("");
    } catch (error) {
      if (error instanceof Error)
        expect(error.message).toBe("Group Id needs to be supplied");
    }
  });
});
