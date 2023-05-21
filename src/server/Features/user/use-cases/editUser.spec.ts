import makeDb, { clearDb, closeDb } from "@/server/__test__/fixures/db";
import makeFakeUser from "@/server/__test__/fixures/user";
import userTests from "@/server/__test__/functions/user";

import { moderateName } from "../../../Utilities/moderateText";
import makeUsersDb from "../data-access/users-db";
import makeEditUser from "./editUser";

const handleModeration = async (name: string) => {
  return await moderateName(name);
};
describe("Edit Users use case", () => {
  jest.setTimeout(50000);
  let usersDb = makeUsersDb({ makeDb });
  const editUser = makeEditUser({ usersDb, handleModeration });

  jest.setTimeout(30000);
  beforeAll(async () => {
    const createdUser = await userTests.addTestUserToDB({
      userId: "12345678910",
    });
    usersDb = makeUsersDb({ makeDb });
  });

  afterEach(async () => {
    const deletedUser = await userTests.deleteTestUser({
      userId: "12345678910",
    });
  });

  jest.setTimeout(50000);
  afterAll(async () => {
    const deletedUser = await userTests.deleteTestUser({
      userId: "12345678910",
    });
    await closeDb();
  });

  it("Error: User id must be passed", async () => {
    expect(editUser({ userId: "", updates: { userId: "e" } })).rejects.toThrow(
      "An userId must be passed"
    );
  });

  it("Error: Updates must exist", async () => {
    expect(editUser({ userId: "123", updates: {} })).rejects.toThrow(
      "At least one update must be passed"
    );
  });

  it("Edit user successfully", async () => {
    const user = await makeFakeUser({ userId: "12345678910" });
    const insertedUser = await usersDb.insert({ data: user });

    const updatedUser = await editUser({
      userId: user.userId,
      updates: {
        username: "JohnB",
      },
    });

    if (updatedUser.success) {
      expect(updatedUser.data?.username).toBe("JohnB");
    }
  });
  it("User does not exist", async () => {
    const updatedUser = await editUser({
      userId: "1",
      updates: { username: "hi" },
    });

    if (updatedUser.success && updatedUser.data === undefined) {
      expect(updatedUser.error).toBe("Could not find any user with that id");
    }
  });
});
