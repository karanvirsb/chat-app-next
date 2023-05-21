import makeDb, { closeDb } from "@/server/__test__/fixures/db";
import makeFakeGroup from "@/server/__test__/fixures/group";
import userTests from "@/server/__test__/functions/user";

import { moderateName } from "../../../Utilities/moderateText";
import makeGroupDb from "../data-access/group-db";
import makeAddGroup from "../use-cases/addGroup";
import makeAddGroupController from "./add-group";

const handleModeration = async (name: string) => {
  return await moderateName(name);
};

describe("Add group controller", () => {
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
  const addGroupController = makeAddGroupController({ addGroup });

  beforeAll(async () => {
    // creating user if it does not exist
    userTests.addTestUserToDB({
      userId: '"cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"',
    });
  });
  // TODO after each add group, before each create group
  afterAll(async () => {
    await userTests.deleteTestUser({
      userId: "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc",
    });
    await closeDb();
  });

  test("SUCCESS: add group to the database", async () => {
    const group = await makeFakeGroup();
    const groupRequest = {
      body: {
        groupInfo: group,
        userId: "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc",
      },
      headers: { "Content-Type": "application/json" },
      ip: "",
      method: "POST",
      params: {},
      path: "",
      query: {},
    };

    const addedGroup = await addGroupController(groupRequest);
    if (addedGroup.body.success)
      expect(addedGroup.body.data?.groupId).toBe(group.groupId);
  });

  test("ERROR: user Id was not given", async () => {
    const group = await makeFakeGroup();
    const groupRequest = {
      body: {
        groupInfo: group,
        userId: "",
      },
      headers: { "Content-Type": "application/json" },
      ip: "",
      method: "POST",
      params: {},
      path: "",
      query: {},
    };

    const addedGroup = await addGroupController(groupRequest);

    expect(addedGroup.statusCode).toBe(400);
    if (!addedGroup.body.success)
      expect(addedGroup.body.error).toBe("User id needs to be supplied");
  });
});
