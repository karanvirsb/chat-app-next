import Express from "express";
import { deleteUserC } from ".";
import makeSupertokenDb, {
  IMakeSupertokensDb,
} from "../../../../supertokens/data-access/supertokens-db";
import { clearDb, closeDb } from "../../../../__test__/fixures/db";
import makeFakeUser from "../../../../__test__/fixures/user";
import { makeDb } from "../data-access";
import makeUsersDb, { IMakeUsersDb } from "../data-access/users-db";
import { addUserUC } from "../AddUser";

describe("delete user controller", () => {
  let usersDb: IMakeUsersDb["returnType"];
  let SupertokensDb: IMakeSupertokensDb["returnType"] = makeSupertokenDb({
    makeDb,
  });

  jest.setTimeout(30000);
  beforeAll(async () => {
    const createdUser = await SupertokensDb.addUser({
      user: {
        user_id: "ce3735e4-b3de-48d4-853e-758c06b1a935",
        email: "randoms@gmai.com",
        password: "123",
        time_joined: Date.now(),
      },
    });
    await clearDb("usert");
    usersDb = makeUsersDb({ makeDb });
  });

  afterEach(async () => {
    await clearDb("usert");
  });

  jest.setTimeout(3000);
  afterAll(async () => {
    const deletedUser = await SupertokensDb.deleteUser({
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

    const httpRequest = Express.request;
    httpRequest.body = {
      id: "ce3735e4-b3de-48d4-853e-758c06b1a935",
    };
    const deletedUser = await deleteUserC(httpRequest);

    expect(deletedUser.body.data.userId).toBe(
      "ce3735e4-b3de-48d4-853e-758c06b1a935"
    );
  });
});
