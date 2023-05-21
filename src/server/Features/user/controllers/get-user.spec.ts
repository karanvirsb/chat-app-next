import { clearDb, closeDb } from "@/server/__test__/fixures/db";
import makeFakeUser from "@/server/__test__/fixures/user";
import userTests from "@/server/__test__/functions/user";

import { addUserUC } from "../AddUser";
import { makeDb } from "../data-access";
import makeUsersDb, { IMakeUsersDb } from "../data-access/users-db";
import { getAnUser } from ".";

describe("Get user controller", () => {
  jest.setTimeout(30000);
  beforeAll(async () => {
    const createdUser = await userTests.addTestUserToDB({
      userId: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
    });
  });

  afterEach(async () => {
    const deletedUser = await userTests.deleteTestUser({
      userId: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
    });
  });

  jest.setTimeout(3000);
  afterAll(async () => {
    const deletedUser = await userTests.deleteTestUser({
      userId: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
    });
    await closeDb();
  });

  it("successfully retrieve user", async () => {
    const fakeUser = await makeFakeUser({
      userId: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
    });
    const resp = await addUserUC(fakeUser);
    const user = await getAnUser({
      body: {},
      headers: {},
      ip: "string",
      method: "GET",
      params: { id: "5c0fc896-1af1-4c26-b917-550ac5eefa9e" },
      path: "",
      query: {},
    });
    console.log(user);
    expect(user.body.data.username).toBe(fakeUser.username);
  });
});
