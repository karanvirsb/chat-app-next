import makeDb, { closeDb } from "@/server/__test__/fixures/db";
import makeFakeUser from "@/server/__test__/fixures/user";
import userTests from "@/server/__test__/functions/user";

import makeUsersDb from "../data-access/users-db";
import makeGetUser from "./getUser";

describe("Get use case", () => {
  jest.setTimeout(50000);
  let usersDb = makeUsersDb({ makeDb });
  const getUser = makeGetUser({ usersDb });

  jest.setTimeout(30000);
  beforeAll(async () => {
    usersDb = makeUsersDb({ makeDb });
  });

  afterEach(async () => {
    await userTests.deleteTestUser({
      userId: "12345678910",
    });
  });

  jest.setTimeout(3000);
  afterAll(async () => {
    await userTests.deleteTestUser({
      userId: "12345678910",
    });
    await closeDb();
  });

  it("UserId was not supplied", async () => {
    expect(getUser("")).rejects.toThrow("UserId must be passed through");
  });

  it("Get user who exists", async () => {
    const user = await makeFakeUser({ userId: "12345678910" });
    await usersDb.insert({ data: user });

    const foundUser = await getUser(user.userId);
    if (foundUser.success) {
      expect(foundUser.data?.userId.trim()).toBe(user.userId.trim());
    }
  });

  it("Get user who does not exist", async () => {
    const foundUser = await getUser("1");
    if (foundUser.success && foundUser.data === undefined) {
      expect(foundUser.error).toBe("Could not find any user with that id");
    }
  });
});
