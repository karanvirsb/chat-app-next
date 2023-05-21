import { clearDb, closeDb } from "@/server/__test__/fixures/db";
import makeFakeUser from "@/server/__test__/fixures/user";
import userTests from "@/server/__test__/functions/user";

import { addUserUC } from "../AddUser";
import { deleteUserC } from ".";

describe("delete user controller", () => {
  jest.setTimeout(30000);
  beforeAll(async () => {
    const createdUser = await userTests.addTestUserToDB({
      userId: "ce3735e4-b3de-48d4-853e-758c06b1a935",
    });
  });

  afterEach(async () => {
    const deletedUser = await userTests.deleteTestUser({
      userId: "ce3735e4-b3de-48d4-853e-758c06b1a935",
    });
  });

  jest.setTimeout(3000);
  afterAll(async () => {
    const deletedUser = await userTests.deleteTestUser({
      userId: "ce3735e4-b3de-48d4-853e-758c06b1a935",
    });
    await closeDb();
  });

  jest.setTimeout(30000);
  it("deleting user", async () => {
    const user = await makeFakeUser({
      userId: "ce3735e4-b3de-48d4-853e-758c06b1a935",
    });
    const resp = await addUserUC(user);

    const deletedUser = await deleteUserC({
      body: { id: "ce3735e4-b3de-48d4-853e-758c06b1a935" },
      headers: {},
      ip: "string",
      method: "GET",
      params: {},
      path: "",
      query: {},
    });

    expect(deletedUser.body.data.userId).toBe(
      "ce3735e4-b3de-48d4-853e-758c06b1a935"
    );
  });
});
