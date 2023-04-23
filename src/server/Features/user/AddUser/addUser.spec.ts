import makeDb, { clearDb, closeDb } from "../../../../__test__/fixures/db";
import makeFakeUser from "../../../../__test__/fixures/user";
import makeSupertokenDb, {
  IMakeSupertokensDb,
} from "../../../../supertokens/data-access/supertokens-db";
import { moderateName } from "../../../Utilities/moderateText";
import makeUsersDb from "../data-access/users-db";
import makeAddUser from "./addUserUseCase";

const handleModeration = async (name: string) => {
  return await moderateName(name);
};

describe("Add User case", () => {
  let usersDb = makeUsersDb({ makeDb });
  const addUser = makeAddUser({ usersDb, handleModeration });

  const SupertokensDb: IMakeSupertokensDb["returnType"] = makeSupertokenDb({
    makeDb,
  });

  beforeAll(async () => {
    const createdUser = await SupertokensDb.addUser({
      user: {
        user_id: "12345678910",
        email: "random@gmai.com",
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

  afterAll(async () => {
    const deletedUser = await SupertokensDb.deleteUser({
      userId: "12345678910",
    });
    await closeDb();
  });

  jest.setTimeout(30000);
  it("User added successfully", async () => {
    const user = await makeFakeUser({ userId: "12345678910" });
    const resp = await addUser(user);
    if (resp.success) {
      expect(resp.data?.username).toBe(user.username);
    }
  });

  it("Duplicate User", async () => {
    const user = await makeFakeUser({ userId: "12345678910" });
    const resp = await addUser(user);
    try {
      const err = await addUser(user);
    } catch (error) {
      if (error instanceof Error)
        expect(error.message).toBe("User already exists");
    }
  });

  it("Moderated username", async () => {
    const user = await makeFakeUser({ userId: "12345678910" });
    user["username"] = "bullshit";

    try {
      const resp = await addUser(user);
    } catch (error) {
      if (error instanceof Error)
        expect(error.message).toBe("Username contains profanity");
    }
  });
});
