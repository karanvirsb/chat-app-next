import makeGetUser from "./getUser";
import makeDb, { clearDb, closeDb } from "../../../../__test__/fixures/db";
import makeUsersDb from "../data-access/users-db";
import makeFakeUser from "../../../../__test__/fixures/user";
import makeSupertokenDb, {
    IMakeSupertokensDb,
} from "../../../../supertokens/data-access/supertokens-db";

describe("Get use case", () => {
    jest.setTimeout(50000);
    let usersDb = makeUsersDb({ makeDb });
    let getUser = makeGetUser({ usersDb });

    let SupertokensDb: IMakeSupertokensDb["returnType"] = makeSupertokenDb({
        makeDb,
    });

    jest.setTimeout(30000);
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

    jest.setTimeout(3000);
    afterAll(async () => {
        const deletedUser = await SupertokensDb.deleteUser({
            userId: "12345678910",
        });
        await closeDb();
    });

    it("UserId was not supplied", async () => {
        expect(getUser("")).rejects.toThrow("UserId must be passed through");
    });

    it("Get user who exists", async () => {
        const user = await makeFakeUser({ userId: "12345678910" });
        await usersDb.insert({ data: user });

        const foundUser = await getUser(user.userId);
        if (foundUser.success) {
            expect(foundUser.data?.userId.trim()).toBe(user.userId.trim());
        }
    });

    it("Get user who does not exist", async () => {
        const foundUser = await getUser("1");
        if (foundUser.success && foundUser.data === undefined) {
            expect(foundUser.error).toBe(
                "Could not find any user with that id"
            );
        }
    });
});
