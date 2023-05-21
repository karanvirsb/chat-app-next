import makeDb, { clearDb, closeDb } from "@/server/__test__/fixures/db";
import makeFakeGroup from "@/server/__test__/fixures/group";
import userTests from "@/server/__test__/functions/user";

import { moderateName } from "../../../Utilities/moderateText";
import makeUsersDb from "../../user/data-access/users-db";
import makeGroupDb from "../data-access/group-db";
import makeAddGroup from "../use-cases/addGroup";
import makeRemoveUserFromGroup from "../use-cases/removeUserFromGroup";
import makeDeleteUserFromGroupController from "./delete-userFromGroup";

const handleModeration = async (name: string) => {
  return await moderateName(name);
};

describe("Remove user from group controller", () => {
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
  // TODO add use case return
  const removeUserFromGroup = makeRemoveUserFromGroup({ groupDb });
  const deleteUserFromGroupController = makeDeleteUserFromGroupController({
    removeUserFromGroup,
  });

  beforeAll(async () => {
    const addedUser = userTests.addTestUserToDB({
      userId: "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc",
    });
    // user: {
    //       user_id: "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc",
    //       email: "anTest@gmai.com",
    //       password: "123",
    //       time_joined: Date.now(),
    //     },
    // if user does not exist create
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

  test("SUCCESS: remove user from group", async () => {
    const group = await makeFakeGroup();
    const groupRequest = {
      body: {
        groupId: group.groupId,
        userId: "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc",
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
    const deletedUser = await deleteUserFromGroupController(groupRequest);
    expect(deletedUser.body.data?.uId).toBe(
      "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
    );
  });

  test("ERROR: missing group id to the group", async () => {
    const group = await makeFakeGroup();
    const groupRequest = {
      body: {
        groupId: "",
        userId: "3443c648-3323-4d6b-8830-c8a1b66a043a",
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
    const deletedUser = await deleteUserFromGroupController(groupRequest);
    expect(deletedUser.body.error).toBe("Group Id needs to be supplied");
  });

  test("ERROR: missing user id ", async () => {
    const group = await makeFakeGroup();
    const groupRequest = {
      body: {
        groupId: group.groupId,
        userId: "",
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
    const deletedUser = await deleteUserFromGroupController(groupRequest);
    expect(deletedUser.body.error).toBe("User Id needs to be supplied");
  });
});
