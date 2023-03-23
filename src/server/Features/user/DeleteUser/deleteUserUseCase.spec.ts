import makeDeleteUser from "./deleteUserUseCase";
import makeDb, { clearDb, closeDb } from "../../../../__test__/fixures/db";
import makeUsersDb from "../data-access/users-db";
import makeFakeUser from "../../../../__test__/fixures/user";
import makeSupertokenDb, {
  IMakeSupertokensDb,
} from "../../../../supertokens/data-access/supertokens-db";

describe("Delete use case", () => {
  let usersDb = makeUsersDb({ makeDb });
  let deleteUser = makeDeleteUser({ usersDb });

  let SupertokensDb: IMakeSupertokensDb["returnType"] = makeSupertokenDb({
    makeDb,
  });
  jest.setTimeout(30000);
  beforeAll(async () => {
    const createdUser = await SupertokensDb.addUser({
      user: {
        user_id: "12345678910",
        email: "randoms@gmai.com",
        password: "123",
        time_joined: Date.now(),
      },
    });
    usersDb = makeUsersDb({ makeDb });
    await clearDb("usert");
  });

  afterEach(async () => {
    await clearDb("usert");
  });

  jest.setTimeout(30000);
  afterAll(async () => {
    const deletedUser = await SupertokensDb.deleteUser({
      userId: "12345678910",
    });
    await closeDb();
  });

  it("Error: Userid was not passed", async () => {
    expect(deleteUser("")).rejects.toThrow("An userId must be passed");
  });

  it("Deleted user successfully", async () => {
    const user = await makeFakeUser({ userId: "12345678910" });
    const insertedUser = await usersDb.insert({ data: user });
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
