import makeDb, { clearDb, closeDb } from "@/server/__test__/fixures/db";
import makeFakeGroup from "@/server/__test__/fixures/group";
import userTests from "@/server/__test__/functions/user";

import { moderateName } from "../../../Utilities/moderateText";
import makeUsersDb from "../../user/data-access/users-db";
import makeGroupDb from "../data-access/group-db";
import makeAddGroup from "../use-cases/addGroup";
import makeGetGroupById from "../use-cases/getGroupbyId";
import makeGetGroupByInviteCode from "../use-cases/getGroupByInviteCode";
import makeGetUsersByGroupId from "../use-cases/getUsersByGroupId";
import makeGetGroupByIdController from "./get-byGroupId";
import makeGetGroupByInviteCodeController from "./get-byGroupInviteCode";
import makeGetUsersByGroupIdController from "./get-UsersByGroupId";

const handleModeration = async (name: string) => {
  return await moderateName(name);
};

describe("Get group and users by id controller", () => {
  // const groupRequest = {
  //     body: {},
  //     headers: {},
  //     ip: "",
  //     method: "",
  //     params: {},
  //     path: "",
  //     query: {},
  // };

  const groupDb = makeGroupDb({ makeDb });
  const addGroup = makeAddGroup({ groupDb, handleModeration });
  const getGroupById = makeGetGroupById({ groupDb });
  const getGroupByInviteCode = makeGetGroupByInviteCode({ groupDb });
  const getUsersByGroupId = makeGetUsersByGroupId({ groupDb });
  const getGroupByIdController = makeGetGroupByIdController({
    getGroupById,
  });
  const getGroupByInviteCodeController = makeGetGroupByInviteCodeController({
    getGroupByInviteCode,
  });
  const getUsersByGroupIdController = makeGetUsersByGroupIdController({
    getUsersByGroupId,
  });

  beforeAll(async () => {
    const addedUser = userTests.addTestUserToDB({
      userId: "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc",
    });
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

  test("SUCCESS: Get group by id", async () => {
    const group = await makeFakeGroup();
    const groupRequest = {
      body: {},
      headers: { "Content-Type": "application/json" },
      ip: "",
      method: "POST",
      params: { groupId: group.groupId },
      path: "",
      query: {},
    };

    const addedGroup = await addGroup(
      group,
      "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
    );

    const foundGroup = await getGroupByIdController(groupRequest);
    expect(foundGroup.body.data?.groupId).toBe(group.groupId);
  });

  test("ERROR: group id is missing for getGroupByIdController", async () => {
    const group = await makeFakeGroup();
    const groupRequest = {
      body: {},
      headers: { "Content-Type": "application/json" },
      ip: "",
      method: "POST",
      params: { groupId: "" },
      path: "",
      query: {},
    };

    const addedGroup = await addGroup(
      group,
      "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
    );

    const foundGroup = await getGroupByIdController(groupRequest);
    expect(foundGroup.statusCode).toBe(400);
    expect(foundGroup.body.error).toBe("Group Id needs to be supplied");
  });

  test("SUCCESS: get group by inviteCode ", async () => {
    const group = await makeFakeGroup();
    const groupRequest = {
      body: {},
      headers: { "Content-Type": "application/json" },
      ip: "",
      method: "POST",
      params: { inviteCode: group.inviteCode },
      path: "",
      query: {},
    };

    const addedGroup = await addGroup(
      group,
      "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
    );

    const foundGroup = await getGroupByInviteCodeController(groupRequest);
    expect(foundGroup.body.data?.groupId).toBe(group.groupId);
  });

  test("ERROR: invite code is missing for getGroupByInviteCodeController", async () => {
    const group = await makeFakeGroup();
    const groupRequest = {
      body: {},
      headers: { "Content-Type": "application/json" },
      ip: "",
      method: "POST",
      params: { inviteCode: "" },
      path: "",
      query: {},
    };

    const addedGroup = await addGroup(
      group,
      "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
    );

    const foundGroup = await getGroupByInviteCodeController(groupRequest);
    expect(foundGroup.statusCode).toBe(400);
    expect(foundGroup.body.error).toBe("Invite code needs to be supplied");
  });

  test("SUCCESS: get group users by groupId ", async () => {
    const group = await makeFakeGroup();
    const groupRequest = {
      body: {},
      headers: { "Content-Type": "application/json" },
      ip: "",
      method: "POST",
      params: { groupId: group.groupId },
      path: "",
      query: {},
    };

    const addedGroup = await addGroup(
      group,
      "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
    );

    const foundUsers = await getUsersByGroupIdController(groupRequest);
    if (foundUsers.body.data)
      expect(foundUsers?.body?.data[0].userId).toBe(
        "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
      );
  });

  test("ERROR: group id is missing for getUsersByGroupIdController", async () => {
    const group = await makeFakeGroup();
    const groupRequest = {
      body: {},
      headers: { "Content-Type": "application/json" },
      ip: "",
      method: "POST",
      params: { groupId: "" },
      path: "",
      query: {},
    };

    const addedGroup = await addGroup(
      group,
      "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
    );

    const foundGroup = await getGroupByIdController(groupRequest);
    expect(foundGroup.statusCode).toBe(400);
    expect(foundGroup.body.error).toBe("Group Id needs to be supplied");
  });
});
