import cuid from "cuid";
import Express from "express";
import groupTests from "../../../../__test__/functions/group";
import groupUserTests from "../../../../__test__/functions/groupUser";
import userTests from "../../../../__test__/functions/user";
import DBUpdateStr from "../../../Utilities/DBUpdateString";
import { makeDb } from "../data-access";
import {
  makeUpdateGroupUserController,
  makeUpdateGroupUserDBA,
  makeUpdateGroupUserUC,
  updateGroupUser,
} from "./updateGroupUser";
import { IGroupUser } from "../groupUsers";
import { ZodError } from "zod";
import id from "../../../Utilities/id";

describe("Testing update group user DB Access", () => {
  const updateGroupUserDBA = makeUpdateGroupUserDBA({ makeDb, DBUpdateStr });
  const uuid = id.makeId();
  beforeAll(async () => {
    await createTests(uuid);
  });

  afterAll(async () => {
    await deleteTests(uuid);
  });
  it("Successfully updating group roles", async () => {
    const result = await updateGroupUserDBA({
      groupId: uuid,
      userId: uuid,
      updates: { roles: ["2000", "2001"] },
    });
    if (result.success) expect(result.data?.roles).toEqual(["2000", "2001"]);
  });
  it("Successfully updating lastChecked", async () => {
    const date = new Date();
    const result = await updateGroupUserDBA({
      groupId: uuid,
      userId: uuid,
      updates: { lastChecked: date },
    });
    if (result.success)
      expect(result.data?.lastChecked.toUTCString()).toEqual(
        date.toUTCString()
      );
  });
});

describe("Testing update group user use case", () => {
  const uuid = cuid();
  const updateGroupUserDBA = makeUpdateGroupUserDBA({ makeDb, DBUpdateStr });
  const updateGroupUserDBAMock = jest
    .fn<typeof updateGroupUserDBA, []>()
    .mockImplementation(() => ({ groupId, userId, updates }) => {
      return Promise.resolve({
        success: true,
        data: {
          gId: groupId,
          uId: userId,
          roles: ["2000"],
          lastChecked: new Date(),
          ...updates,
        } as IGroupUser,
        error: "",
      });
    });
  const updateGroupUserUC = makeUpdateGroupUserUC({ updateGroupUserDBA });
  const updateGroupUserUCMock = makeUpdateGroupUserUC({
    updateGroupUserDBA: new updateGroupUserDBAMock(),
  });
  beforeAll(async () => {
    await createTests(uuid);
  });

  afterAll(async () => {
    await deleteTests(uuid);
  });

  it("SUCCESS: update group user use case", async () => {
    const date = new Date();
    const updateParams = {
      groupId: uuid,
      userId: uuid,
      updates: {
        roles: ["2000", "2001"],
        lastChecked: date,
      },
    };

    const result = await updateGroupUserUC(updateParams);
    if (result.success)
      expect(result.data?.roles).toEqual(updateParams.updates.roles);
  });
  it("ERROR: update group user use case, group id is not given", async () => {
    const date = new Date();
    const updateParams = {
      groupId: "",
      userId: uuid,
      updates: {
        roles: ["2000", "2001"],
        lastChecked: date,
      },
    };

    const result = await updateGroupUserUC(updateParams);

    if (!result.success && result.error instanceof ZodError) {
      const error = result.error as ZodError<updateGroupUser>;

      expect(error.format().groupId?._errors[0]).toBe(
        "String must contain at least 21 character(s)"
      );
    }
  });

  it("ERROR: update group user use case, user id is not given", async () => {
    const date = new Date();
    const updateParams = {
      groupId: uuid,
      userId: "",
      updates: {
        roles: ["2000", "2001"],
        lastChecked: date,
      },
    };

    const result = await updateGroupUserUC(updateParams);

    if (!result.success && result.error instanceof ZodError) {
      const error = result.error as ZodError<updateGroupUser>;

      expect(error.format().userId?._errors[0]).toBe(
        "String must contain at least 21 character(s)"
      );
    }
  });

  it("ERROR: update group user use case, role is not given", async () => {
    const date = new Date();
    const updateParams = {
      groupId: uuid,
      userId: uuid,
      updates: {
        roles: [],
        lastChecked: date,
      },
    };

    const result = await updateGroupUserUC(updateParams);
    if (!result.success && result.error instanceof ZodError) {
      const error = result.error as ZodError<updateGroupUser>;

      expect(error.format().updates?.roles?._errors[0]).toBe(
        "Array must contain at least 1 element(s)"
      );
    }
  });
});

describe("Testing update group user controller", () => {
  const uuid = cuid();
  const updateGroupUserDBA = makeUpdateGroupUserDBA({ makeDb, DBUpdateStr });
  const updateGroupUserUC = makeUpdateGroupUserUC({ updateGroupUserDBA });
  const updateGroupUserUCMock = jest
    .fn<typeof updateGroupUserUC, []>()
    .mockImplementation(() => ({ groupId, userId, updates }) => {
      return Promise.resolve({
        success: true,
        data: {
          gId: groupId,
          uId: userId,
          roles: ["2000", "2001"],
          lastChecked: new Date(),
          ...updates,
        } as IGroupUser,
        error: "",
      });
    });
  const updateGroupUserController = makeUpdateGroupUserController({
    updateGroupUserUC: new updateGroupUserUCMock(),
  });
  beforeAll(async () => {
    await createTests(uuid);
  });

  afterAll(async () => {
    await deleteTests(uuid);
  });

  test("SUCCESS: update group user", async () => {
    const httpRequest = Express.request;
    httpRequest.body = {
      groupId: uuid,
      userId: uuid,
      updates: {
        roles: ["2000", "2001"],
        lastChecked: new Date().toISOString(),
      },
    };

    const result = await updateGroupUserController(httpRequest);
    if (result.body.success)
      expect(result.body.data?.roles).toEqual(["2000", "2001"]);
  });
});

async function deleteTests(uuid: string) {
  let testUser = await userTests.deleteTestUser({ userId: uuid });
  let testGroup = await groupTests.deleteTestGroup({
    groupId: uuid,
    userId: uuid,
  });
  let testGroupUser = await groupUserTests.deleteGroupUserTest({
    groupId: uuid,
    userId: uuid,
  });
}

async function createTests(uuid: string) {
  let testUser = await userTests.addTestUserToDB({ userId: uuid });
  let testGroup = await groupTests.createTestGroup({
    groupId: uuid,
    userId: uuid,
  });
  let testGroupUser = await groupUserTests.createGroupUserTest({
    groupId: uuid,
    userId: uuid,
  });
}
