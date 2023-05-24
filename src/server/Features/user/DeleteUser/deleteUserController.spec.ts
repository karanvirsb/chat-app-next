import { closeDb } from "@/server/__test__/fixures/db";
import makeFakeUser from "@/server/__test__/fixures/user";
import userTests from "@/server/__test__/functions/user";

import { addUserUC } from "../AddUser";
import { IUser } from "../user";
import { deleteUserC } from ".";

describe("delete user controller", () => {
  let user: IUser;
  beforeAll(async () => {
    user = await makeFakeUser({
      userId: "ce3735e4-b3de-48d4-853e-758c06b1a935",
    });
  });

  afterEach(async () => {
    await userTests.deleteTestUser({
      userId: "ce3735e4-b3de-48d4-853e-758c06b1a935",
    });
  });

  visetTimeout(3000);
  afterAll(async () => {
    await userTests.deleteTestUser({
      userId: "ce3735e4-b3de-48d4-853e-758c06b1a935",
    });
    await closeDb();
  });

  it("deleting user", async () => {
    await addUserUC(user);

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
