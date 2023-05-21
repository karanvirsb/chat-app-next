import { closeDb } from "@/server/__test__/fixures/db";
import makeFakeUser from "@/server/__test__/fixures/user";
import userTests from "@/server/__test__/functions/user";

import { addUserUC } from "../AddUser";
import { IUser } from "../user";
import { getAnUser } from ".";

describe("Get user controller", () => {
  let fakeUser: IUser;
  beforeAll(async () => {
    fakeUser = await makeFakeUser({
      userId: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
    });
    await userTests.addTestUserToDB({
      userId: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
    });
  });

  afterEach(async () => {
    await userTests.deleteTestUser({
      userId: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
    });
  });

  jest.setTimeout(3000);
  afterAll(async () => {
    await userTests.deleteTestUser({
      userId: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
    });
    await closeDb();
  });

  it("successfully retrieve user", async () => {
    await addUserUC(fakeUser);
    const user = await getAnUser({
      body: {},
      headers: {},
      ip: "string",
      method: "GET",
      params: { id: "5c0fc896-1af1-4c26-b917-550ac5eefa9e" },
      path: "",
      query: {},
    });
    expect(user.body.data.username).toBe(fakeUser.username);
  });
});
