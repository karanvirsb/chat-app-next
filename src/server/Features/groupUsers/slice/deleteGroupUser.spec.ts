import {
  makeDeleteGroupUserController,
  makeDeleteGroupUserDBA,
  makeDeleteGroupUserUC,
} from "./deleteGroupUser";
import makeDb from "../../../../__test__/fixures/db";
import groupTests from "../../../../__test__/functions/group";
import userTests from "../../../../__test__/functions/user";
import groupUserTests from "../../../../__test__/functions/groupUser";
import { IGroupUser } from "../groupUsers";
import Express from "express";
import id from "../../../Utilities/id";

describe("Testing deleting group user DB", () => {
  let uuid = id.makeId();
  const deleteGroupUserDBA = makeDeleteGroupUserDBA({ makeDb });
  beforeAll(async () => {
    await createTests(uuid);
  });

  afterAll(async () => {
    await deleteTests(uuid);
  });

  it("Create user successfully", async () => {
    const deleteGroupUser = await deleteGroupUserDBA({
      groupId: uuid,
      userId: uuid,
    });

    expect(deleteGroupUser.data?.gId).toBe(uuid);

    expect(deleteGroupUser.data?.uId).toBe(uuid);
  });
});

describe("Test Delete group user use case", () => {
  const deleteGroupUserDBA = makeDeleteGroupUserDBA({ makeDb });
  const deleteGroupUserMockedDBA = jest.fn(deleteGroupUserDBA);
  deleteGroupUserMockedDBA.mockResolvedValueOnce(
    Promise.resolve({
      success: true,
      data: {
        gId: "123",
        uId: "123",
        roles: ["2000"],
        lastChecked: new Date(),
      },
      error: "",
    })
  );
  let deleteGroupUserUC = makeDeleteGroupUserUC({
    deleteGroupUserDBA: deleteGroupUserMockedDBA,
  });

  beforeAll(async () => {
    await createTests("123");
  });

  afterAll(async () => {
    await deleteTests("123");
    jest.resetAllMocks();
  });

  it("SUCCESS: Delete group user", async () => {
    const result = await deleteGroupUserUC({ groupId: "123", userId: "123" });
    expect(result.data?.gId).toBe("123");
    expect(result.data?.uId).toBe("123");
  });

  it("ERROR: GroupId needs to be supplied", async () => {
    try {
      const result = await deleteGroupUserUC({ groupId: "", userId: "123" });
    } catch (error) {
      if (error instanceof Error)
        expect(error.message).toBe(
          "GroupId must be a string and must have length greater than 0."
        );
    }
  });

  it("SUCCESS: UserId needs to be supplied", async () => {
    try {
      const result = await deleteGroupUserUC({ groupId: "123", userId: "" });
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe(
          "UserId must be a string and must have length greater than 0."
        );
      }
    }
  });
});

describe("Test Delete group user controller", () => {
  const deleteGroupUserDBA = makeDeleteGroupUserDBA({ makeDb });
  type args = { groupId: string; userId: string };
  let deleteGroupUserUC = makeDeleteGroupUserUC({ deleteGroupUserDBA });
  let deleteGroupUserUCMock = jest.fn<typeof deleteGroupUserUC, []>();
  deleteGroupUserUCMock.mockImplementation(() => ({ groupId, userId }) => {
    return Promise.resolve({
      success: true,
      data: {
        gId: groupId,
        uId: userId,
        roles: ["2000"],
        lastChecked: new Date(),
      } as IGroupUser,
      error: "",
    });
  });

  let deleteGroupUserC = makeDeleteGroupUserController({ deleteGroupUserUC });

  beforeAll(async () => {
    await createTests("123");
  });

  afterAll(async () => {
    await deleteTests("123");
  });

  it("SUCCESS: Delete group user", async () => {
    const httpRequest = Express.request;
    httpRequest.query = {
      groupId: "123",
      userId: "123",
    };

    const result = await deleteGroupUserC(httpRequest);

    expect(result.body.data?.gId).toBe("123");
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
