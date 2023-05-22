import makeDb, { closeDb } from "@/server/__test__/fixures/db";
import makeFakeGroup from "@/server/__test__/fixures/group";
import groupTests from "@/server/__test__/functions/group";
import userTests from "@/server/__test__/functions/user";

import { moderateName } from "../../../Utilities/moderateText";
import makeGroupDb from "../data-access/group-db";
import { IGroup } from "../group";
import makeAddGroup from "../use-cases/addGroup";
import makeDeleteGroup from "../use-cases/deleteGroup";
import makeDeleteGroupController from "./delete-group";

const handleModeration = async (name: string) => {
  return await moderateName(name);
};

describe("Delete group controller", () => {
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
  const deleteGroup = makeDeleteGroup({ groupDb });
  const deleteGroupController = makeDeleteGroupController({ deleteGroup });

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
  test("SUCCESS: add group to the database", async () => {
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

    await addGroup(group, "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc");
    const deletedGroup = await deleteGroupController(groupRequest);
    if (deletedGroup.body.success)
      expect(deletedGroup.body.data?.groupId).toBe(group.groupId);
  });

  test("ERROR: group Id was not given", async () => {
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
    await addGroup(group, "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc");
    const deletedGroup = await deleteGroupController(groupRequest);

    expect(deletedGroup.statusCode).toBe(400);
    if (!deletedGroup.body.success)
      expect(deletedGroup.body.error).toBe("Group Id needs to be supplied");
  });
});
