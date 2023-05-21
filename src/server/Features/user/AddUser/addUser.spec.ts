import makeDb, { closeDb } from "@/server/__test__/fixures/db";
import makeFakeUser from "@/server/__test__/fixures/user";
import userTests from "@/server/__test__/functions/user";

import { moderateName } from "../../../Utilities/moderateText";
import makeUsersDb from "../data-access/users-db";
import makeAddUser from "./addUserUseCase";

const handleModeration = async (name: string) => {
  return await moderateName(name);
};

describe("Add User case", () => {
  const usersDb = makeUsersDb({ makeDb });
  const addUser = makeAddUser({ usersDb, handleModeration });

  afterEach(async () => {
    await userTests.deleteTestUser({
      userId: "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc",
    });
  });

  afterAll(async () => {
    // TODO
    await userTests.deleteTestUser({
      userId: "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc",
    });
    await closeDb();
  });

  jest.setTimeout(30000);
  it("User added successfully", async () => {
    const user = await makeFakeUser({
      userId: "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc",
    });
    const resp = await addUser(user);
    if (resp.success) {
      expect(resp.data?.username).toBe(user.username);
    }
  });

  it("Duplicate User", async () => {
    const user = await makeFakeUser({
      userId: "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc",
    });

    try {
      await addUser(user);
    } catch (error) {
      if (error instanceof Error)
        expect(error.message).toBe("User already exists");
    }
  });

  it("Moderated username", async () => {
    const user = await makeFakeUser({
      userId: "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc",
    });
    user["username"] = "bullshit";

    try {
      await addUser(user);
    } catch (error) {
      if (error instanceof Error)
        expect(error.message).toBe("Username contains profanity");
    }
  });
});
