import makeDb, { closeDb } from "@/server/__test__/fixures/db";
import makeFakeGroup from "@/server/__test__/fixures/group";
import groupTests from "@/server/__test__/functions/group";
import userTests from "@/server/__test__/functions/user";

import { moderateName } from "../../../Utilities/moderateText";
import makeGroupDb from "../data-access/group-db";
import { IGroup } from "../group";
import makeAddGroup from "../use-cases/addGroup";
import makeGetGroupsByUserId from "../use-cases/getGroupsByUserId";
import makeGetGroupsByUserIdController from "./get-groupsByUserId";

const handleModeration = async (name: string) => {
  return await moderateName(name);
};

describe("get groups by user Id controller", () => {
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
  const getGroupsByUserId = makeGetGroupsByUserId({ groupDb });
  const getGroupsByUserIdController = makeGetGroupsByUserIdController({
    getGroupsByUserId,
  });

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
    groupTests.deleteTestGroup({
      groupId: group.groupId,
      userId: "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc",
    });
    await closeDb();
  });

  test("SUCCESS: get groups by user id", async () => {
    const groupRequest = {
      body: {},
      headers: { "Content-Type": "application/json" },
      ip: "",
      method: "POST",
      params: { userId: "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc" },
      path: "",
      query: {},
    };

    await addGroup(group, "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc");
    const foundGroups = await getGroupsByUserIdController(groupRequest);
    if (foundGroups.body.data)
      expect(foundGroups.body.data[0].groupId).toBe(group.groupId);
  });

  test("ERROR: missing user id", async () => {
    const groupRequest = {
      body: {},
      headers: { "Content-Type": "application/json" },
      ip: "",
      method: "POST",
      params: { userId: "" },
      path: "",
      query: {},
    };

    await addGroup(group, "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc");
    const foundGroups = await getGroupsByUserIdController(groupRequest);
    expect(foundGroups.body.error).toBe("User Id needs to be supplied.");
  });
});
