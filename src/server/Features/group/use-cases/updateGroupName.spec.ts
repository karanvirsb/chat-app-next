import sanitizeHtml from "sanitize-html";

import makeDb, { closeDb } from "@/server/__test__/fixures/db";
import makeFakeGroup from "@/server/__test__/fixures/group";
import groupTests from "@/server/__test__/functions/group";
import userTests from "@/server/__test__/functions/user";

import { moderateName } from "../../../Utilities/moderateText";
import makeGroupDb from "../data-access/group-db";
import { IGroup } from "../group";
import makeAddGroup from "./addGroup";
import makeUpdateGroupName from "./updateGroupName";

const handleModeration = async (name: string) => {
  return await moderateName(name);
};

function sanitizeText(text: string) {
  return sanitizeHtml(text);
}

describe("Updating group name use case", () => {
  const groupDb = makeGroupDb({ makeDb });
  const addGroup = makeAddGroup({ groupDb, handleModeration });
  const updateGroupName = makeUpdateGroupName({
    groupDb,
    handleModeration,
    sanitizeName: sanitizeText,
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
    await groupTests.deleteTestGroup({
      groupId: group.groupId,
      userId: "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc",
    });
    await closeDb();
  });

  test("Update group name success", async () => {
    const group = await makeFakeGroup();
    const res = await addGroup(group, "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc");

    if (res.success) {
      const updatedGroup = await updateGroupName(group.groupId, "Coders");
      expect(updatedGroup.data?.groupName).toBe("Coders");
    }
  });

  test("ERROR: Update group name no group id", async () => {
    await addGroup(group, "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc");

    try {
      await updateGroupName("", "Coders");
    } catch (error) {
      if (error instanceof Error)
        expect(error.message).toBe("Group id needs to be supplied");
    }
  });

  test("ERROR: Update group name no new group name", async () => {
    await addGroup(group, "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc");

    try {
      await updateGroupName(group.groupId, "");
    } catch (error) {
      if (error instanceof Error)
        expect(error.message).toBe("A new group name must be supplied");
    }
  });

  test("ERROR: Update group name contains profanity", async () => {
    await addGroup(group, "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc");

    try {
      await updateGroupName(group.groupId, "bullshit");
    } catch (error) {
      console.log((error as Error).message);
      if (error instanceof Error) {
        expect(error.message).toBe("Group name contains profanity");
      }
    }
  });

  test("ERROR: Update group name contains html", async () => {
    await addGroup(group, "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc");

    try {
      await updateGroupName(group.groupId, "<html>n</html>");
    } catch (error) {
      if (error instanceof Error)
        expect(error.message).toBe("Group name must contain valid characters");
    }
  });

  test("ERROR: Update group name must be between 3 - 50 characters", async () => {
    await addGroup(group, "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc");

    try {
      await updateGroupName(
        group.groupId,
        "123456789012345678901234567890123456789012345678901234567890"
      );
    } catch (error) {
      if (error instanceof Error)
        expect(error.message).toBe(
          "Group name must be between 3 and 50 characters long"
        );
    }
  });
});
