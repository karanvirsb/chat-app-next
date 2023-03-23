import makeDb from "../../../../__test__/fixures/db";
import groupTests from "../../../../__test__/functions/group";
import userTests from "../../../../__test__/functions/user";
import {
  makeCreateGroupDBAccess,
  makeCreateGroupUseCase,
} from "./createGroupUser";
import id from "../../../Utilities/id";
import { ZodError } from "zod";
import { IGroupUser } from "../groupUsers";

describe("Create Group User Tests DBA", () => {
  let createGroupDb = makeCreateGroupDBAccess({ makeDb });
  let uuid = id.makeId();
  beforeAll(async () => {
    let testUser = await userTests.addTestUserToDB({ userId: uuid });
    let testGroup = await groupTests.createTestGroup({
      groupId: uuid,
      userId: uuid,
    });
  });

  afterAll(async () => {
    let testUser = await userTests.deleteTestUser({ userId: uuid });
    let testGroup = await groupTests.deleteTestGroup({
      groupId: uuid,
      userId: uuid,
    });
  });
  it("Create user successfully", async () => {
    const groupUser = await createGroupDb({
      gId: uuid,
      uId: uuid,
      roles: ["2000"],
      lastChecked: new Date(),
    });
    console.log(groupUser);
    expect(groupUser.data?.gId).toBe(uuid);

    expect(groupUser.data?.uId).toBe(uuid);
  });
});

describe("Testing create group user use case", () => {
  let createGroupDb = makeCreateGroupDBAccess({ makeDb });
  let uuid = id.makeId();
  beforeAll(async () => {
    let testUser = await userTests.addTestUserToDB({ userId: uuid });
    let testGroup = await groupTests.createTestGroup({
      groupId: uuid,
      userId: uuid,
    });
  });

  afterAll(async () => {
    let testUser = await userTests.deleteTestUser({ userId: uuid });
    let testGroup = await groupTests.deleteTestGroup({
      groupId: uuid,
      userId: uuid,
    });
  });
  it("SUCCESS: Created group user", async () => {
    const createGroupMocked = jest.fn(createGroupDb);
    createGroupMocked.mockResolvedValueOnce(
      Promise.resolve({
        success: true,
        data: {
          gId: uuid,
          uId: uuid,
          roles: ["2000"],
          lastChecked: new Date(),
        },
        error: "",
      })
    );

    let createGroupUseCase = makeCreateGroupUseCase({
      createGroupDb: createGroupMocked,
    });
    const createdGroupUser = await createGroupUseCase({
      gId: uuid,
      uId: uuid,
      roles: ["2000"],
      lastChecked: new Date(),
    });

    expect(createdGroupUser.data?.gId).toBe(uuid);
    expect(createdGroupUser.data?.gId).toBe(uuid);
  });

  it("ERROR: Created group user does not have group id", async () => {
    const createGroupMocked = jest.fn(createGroupDb);

    let createGroupUseCase = makeCreateGroupUseCase({
      createGroupDb: createGroupMocked,
    });

    try {
      const createdGroupUser = await createGroupUseCase({
        gId: "",
        uId: uuid,
        roles: ["2000"],
        lastChecked: new Date(),
      });
    } catch (error) {
      expect((error as ZodError<IGroupUser>).format()?.gId?._errors[0]).toBe(
        "String must contain at least 21 character(s)"
      );
    }
  });
});
