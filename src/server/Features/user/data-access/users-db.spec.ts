import makeDb, { clearDb, closeDb } from "../../../../__test__/fixures/db";
import makeUsersDb, { IMakeUsersDb } from "./users-db";
import makeFakerUser from "../../../../__test__/fixures/user";
import makeSupertokenDb, {
    IMakeSupertokensDb,
} from "../../../../supertokens/data-access/supertokens-db";

describe("Users DB", () => {
    let UsersDb: IMakeUsersDb["returnType"];
    let SupertokensDb: IMakeSupertokensDb["returnType"] = makeSupertokenDb({
        makeDb,
    });

    beforeAll(async () => {
        const createdUser = await SupertokensDb.addUser({
            user: {
                user_id: "1234",
                email: "random@gmai.com",
                password: "123",
                time_joined: Date.now(),
            },
        });
        UsersDb = makeUsersDb({ makeDb });
        await clearDb("usert");
    });

    afterEach(async () => {
        await clearDb("usert");
    });

    afterAll(async () => {
        const deletedUser = await SupertokensDb.deleteUser({ userId: "1234" });
        await closeDb();
    });
    it("Insert a user", async () => {
        // successful
        const user = await makeFakerUser({ userId: "1234" });
        const resp = await UsersDb.insert({ data: user });

        if (resp.success) {
            expect(resp?.data?.username).toBe(user.username);
        }
    });
    it("Find user by Id", async () => {
        //successful
        const fakeUser = await makeFakerUser({ userId: "1234" });
        const insertedUser = await UsersDb.insert({ data: fakeUser });
        const resp = await UsersDb.findById({ id: fakeUser.userId });
        if (resp.success) {
            expect(resp.data?.username).toBe(fakeUser.username);
        }
    });

    it("Find user by username", async () => {
        // success
        const fakeUser = await makeFakerUser({ userId: "1234" });
        const insertedUser = await UsersDb.insert({ data: fakeUser });
        const resp = await UsersDb.findByUsername(fakeUser.username);
        if (resp.success) {
            expect(resp.data?.username).toBe(fakeUser.username);
        }
    });

    it("Remove user by Id", async () => {
        const fakeUser = await makeFakerUser({ userId: "1234" });
        const insertedUser = await UsersDb.insert({ data: fakeUser });
        const resp = await UsersDb.remove(fakeUser.userId);
        if (resp.success) {
            expect(resp.data?.username).toBe(fakeUser.username);
        }
    });

    it("Update user by username", async () => {
        const fakeUser = await makeFakerUser({ userId: "1234" });
        const insertedUser = await UsersDb.insert({ data: fakeUser });
        const resp = await UsersDb.updateByUsername({
            username: fakeUser.username,
            updates: {
                status: "offline",
            },
        });
        if (resp.success) {
            expect(resp.data?.status).toBe("offline");
        }
    });

    it("Update user by user id", async () => {
        const fakeUser = await makeFakerUser({ userId: "1234" });
        const insertedUser = await UsersDb.insert({ data: fakeUser });
        const resp = await UsersDb.updateByUserId({
            userId: fakeUser.userId,
            updates: {
                username: "johnB",
                status: "offline",
            },
        });
        if (resp.success) {
            expect(resp.data?.username).toBe("johnB");
            expect(resp.data?.status).toBe("offline");
        }
    });
});
