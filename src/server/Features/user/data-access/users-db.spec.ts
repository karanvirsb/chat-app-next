import makeDb, { closeDb } from "@/server/__test__/fixures/db";
import makeFakerUser from "@/server/__test__/fixures/user";
import userTests from "@/server/__test__/functions/user";

import { IUser } from "../user";
import makeUsersDb, { IMakeUsersDb } from "./users-db";

describe("Users DB", () => {
  let UsersDb: IMakeUsersDb["returnType"];
  let user: IUser;
  beforeAll(async () => {
    user = await makeFakerUser({ userId: "1234" });
    // await userTests.addTestUserToDB({
    //   userId: "1234",
    // });
    UsersDb = makeUsersDb({ makeDb });
  });

  afterEach(async () => {
    await userTests.deleteTestUser({ userId: "1234" });
  });

  afterAll(async () => {
    await userTests.deleteTestUser({ userId: "1234" });
    await closeDb();
  });
  it("Insert a user", async () => {
    // successful
    const resp = await UsersDb.insert({ data: user });

    if (resp.success) {
      expect(resp?.data?.username).toBe(user.username);
    }
  });
  it("Find user by Id", async () => {
    //successful

    await UsersDb.insert({ data: user });
    const resp = await UsersDb.findById({ id: user.userId });
    if (resp.success) {
      expect(resp.data?.username).toBe(user.username);
    }
  });

  it("Find user by username", async () => {
    // success
    await UsersDb.insert({ data: user });
    const resp = await UsersDb.findByUsername(user.username);
    if (resp.success) {
      expect(resp.data?.username).toBe(user.username);
    }
  });

  it("Remove user by Id", async () => {
    await UsersDb.insert({ data: user });
    const resp = await UsersDb.remove(user.userId);
    if (resp.success) {
      expect(resp.data?.username).toBe(user.username);
    }
  });

  it("Update user by username", async () => {
    await UsersDb.insert({ data: user });
    const resp = await UsersDb.updateByUsername({
      username: user.username,
      updates: {
        status: "offline",
      },
    });
    if (resp.success) {
      expect(resp.data?.status).toBe("offline");
    }
  });

  it("Update user by user id", async () => {
    await UsersDb.insert({ data: user });
    const resp = await UsersDb.updateByUserId({
      userId: user.userId,
      updates: {
        username: "johnB",
        status: "offline",
      },
    });
    if (resp.success) {
      expect(resp.data?.username).toBe("johnB");
      expect(resp.data?.status).toBe("offline");
    }
  });
});
