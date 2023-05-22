import makeDb, { closeDb } from "@/server/__test__/fixures/db";
import makeFakeGroup from "@/server/__test__/fixures/group";
import groupTests from "@/server/__test__/functions/group";
import userTests from "@/server/__test__/functions/user";

import { moderateName } from "../../../Utilities/moderateText";
import makeGroupDb from "../data-access/group-db";
import { IGroup } from "../group";
import makeAddGroup from "./addGroup";
import makeGetGroupsByUserId from "./getGroupsByUserId";

const handleModeration = async (name: string) => {
  return await moderateName(name);
};

describe("Get groups by user id cases", () => {
  const groupDb = makeGroupDb({ makeDb });
  const addGroup = makeAddGroup({ groupDb, handleModeration });
  const getGroupsByUserId = makeGetGroupsByUserId({ groupDb });
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

  test("SUCCESS: Get groups by user id", async () => {
    await addGroup(group, "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc");

    const foundGroups = await getGroupsByUserId(
      "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
    );

    if (foundGroups.data)
      expect(foundGroups.data[0].groupId).toBe(group.groupId);
  });

  test("ERROR: user id is missing", async () => {
    await addGroup(group, "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc");

    try {
      await getGroupsByUserId("");
    } catch (error) {
      if (error instanceof Error)
        expect(error.message).toBe("User Id needs to be supplied.");
    }
  });
});
