import makeDb, { clearDb, closeDb } from "@/server/__test__/fixures/db";
import makeFakeGroup from "@/server/__test__/fixures/group";
import userTests from "@/server/__test__/functions/user";

import { moderateName } from "../../../Utilities/moderateText";
import makeUsersDb from "../../user/data-access/users-db";
import makeGroupDb from "../data-access/group-db";
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

  beforeAll(async () => {
    // creating user if it does not exist
    const addedUser = userTests.addTestUserToDB({
      userId: "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc",
    });
    // user: {
    //           user_id: "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc",
    //           email: "anTest@gmai.com",
    //           password: "123",
    //           time_joined: Date.now(),
    //         },
  });

  afterAll(async () => {
    // TODO only delete the group test
    // // TODO await clearDb("groupt");
    // // TODO await clearDb('"groupUsers"');
    await userTests.deleteTestUser({
      userId: "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc",
    });
    await closeDb();
  });

  test("SUCCESS: add group to the database", async () => {
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
    const deletedGroup = await deleteGroupController(groupRequest);
    if (deletedGroup.body.success)
      expect(deletedGroup.body.data?.groupId).toBe(group.groupId);
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
    const deletedGroup = await deleteGroupController(groupRequest);

    expect(deletedGroup.statusCode).toBe(400);
    if (!deletedGroup.body.success)
      expect(deletedGroup.body.error).toBe("Group Id needs to be supplied");
  });
});
