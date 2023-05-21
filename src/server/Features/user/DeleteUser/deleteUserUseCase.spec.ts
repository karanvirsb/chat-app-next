import makeDb, { closeDb } from "@/server/__test__/fixures/db";
import makeFakeUser from "@/server/__test__/fixures/user";
import userTests from "@/server/__test__/functions/user";

import makeUsersDb from "../data-access/users-db";
import { IUser } from "../user";
import makeDeleteUser from "./deleteUserUseCase";

describe("Delete use case", () => {
  let usersDb = makeUsersDb({ makeDb });
  const deleteUser = makeDeleteUser({ usersDb });
  let user: IUser;
  jest.setTimeout(30000);
  beforeAll(async () => {
    user = await makeFakeUser({ userId: "12345678910" });
    usersDb = makeUsersDb({ makeDb });
  });

  afterEach(async () => {
    await userTests.deleteTestUser({
      userId: "12345678910",
    });
  });

  jest.setTimeout(30000);
  afterAll(async () => {
    await userTests.deleteTestUser({
      userId: "12345678910",
    });
    await closeDb();
  });

  it("Error: Userid was not passed", async () => {
    expect(deleteUser("")).rejects.toThrow("An userId must be passed");
  });

  it("Deleted user successfully", async () => {
    await usersDb.insert({ data: user });
    const deletedUser = await deleteUser(user.userId);

    if (deletedUser.success) {
      expect(deletedUser.data?.userId.trim()).toBe(user.userId);
    }
  });

  it("User does not exist", async () => {
    const deletedUser = await deleteUser("1");

    if (deletedUser.success && deletedUser.data === undefined) {
      expect(deletedUser.error).toBe("Could not find any user with that id");
    }
  });
});
