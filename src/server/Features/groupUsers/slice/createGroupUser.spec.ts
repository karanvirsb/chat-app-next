import { ZodError } from "zod";

import makeDb from "../../../../__test__/fixures/db";
import groupTests from "../../../../__test__/functions/group";
import userTests from "../../../../__test__/functions/user";
import id from "../../../Utilities/id";
import { IGroupUser } from "../groupUsers";
import {
  makeCreateGroupDBAccess,
  makeCreateGroupUseCase,
} from "./createGroupUser";

describe("Create Group User Tests DBA", () => {
  const createGroupDb = makeCreateGroupDBAccess({ makeDb });
  const uuid = id.makeId();
  beforeAll(async () => {
    const testUser = await userTests.addTestUserToDB({ userId: uuid });
    const testGroup = await groupTests.createTestGroup({
      groupId: uuid,
      userId: uuid,
    });
  });

  afterAll(async () => {
    const testUser = await userTests.deleteTestUser({ userId: uuid });
    const testGroup = await groupTests.deleteTestGroup({
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
  const createGroupDb = makeCreateGroupDBAccess({ makeDb });
  const uuid = id.makeId();
  beforeAll(async () => {
    const testUser = await userTests.addTestUserToDB({ userId: uuid });
    const testGroup = await groupTests.createTestGroup({
      groupId: uuid,
      userId: uuid,
    });
  });

  afterAll(async () => {
    const testUser = await userTests.deleteTestUser({ userId: uuid });
    const testGroup = await groupTests.deleteTestGroup({
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

    const createGroupUseCase = makeCreateGroupUseCase({
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

    const createGroupUseCase = makeCreateGroupUseCase({
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
