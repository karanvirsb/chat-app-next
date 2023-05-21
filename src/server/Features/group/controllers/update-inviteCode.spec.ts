import makeDb, { clearDb, closeDb } from "@/server/__test__/fixures/db";
import makeFakeGroup from "@/server/__test__/fixures/group";
import userTests from "@/server/__test__/functions/user";

import inviteCodeGenerator from "../../../Utilities/inviteCodeGenerator";
import { moderateName } from "../../../Utilities/moderateText";
import makeUsersDb from "../../user/data-access/users-db";
import makeGroupDb from "../data-access/group-db";
import makeAddGroup from "../use-cases/addGroup";
import makeUpdateInviteCode from "../use-cases/updateInviteCode";
import makeUpdateInviteCodeController from "./update-inviteCode";

const handleModeration = async (name: string) => {
  return await moderateName(name);
};

describe("Update group invite code controller", () => {
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
  const updateInviteCode = makeUpdateInviteCode({
    groupDb,
    inviteCodeGenerator,
  });
  const updateInviteCodeController = makeUpdateInviteCodeController({
    updateInviteCode,
  });

  beforeAll(async () => {
    const addedUser = userTests.addTestUserToDB({
      userId: "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc",
    });
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

  test("SUCCESS: invite code has been updated", async () => {
    const group = await makeFakeGroup();
    const groupRequest = {
      body: {
        groupId: group.groupId,
      },
      headers: { "Content-Type": "application/json" },
      ip: "",
      method: "POST",
      params: {},
      path: "",
      query: {},
    };

    const addedGroup = await addGroup(
      group,
      "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
    );
    const updatedGroup = await updateInviteCodeController(groupRequest);
    expect(updatedGroup.body.data?.inviteCode).not.toEqual(group.inviteCode);
  });

  test("ERROR: group Id was not given", async () => {
    const group = await makeFakeGroup();
    const groupRequest = {
      body: {
        groupId: "",
      },
      headers: { "Content-Type": "application/json" },
      ip: "",
      method: "POST",
      params: {},
      path: "",
      query: {},
    };
    const addedGroup = await addGroup(
      group,
      "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
    );
    const updatedGroup = await updateInviteCodeController(groupRequest);

    expect(updatedGroup.statusCode).toBe(400);
    expect(updatedGroup.body.error).toBe("Group Id needs to be supplied");
  });
});
