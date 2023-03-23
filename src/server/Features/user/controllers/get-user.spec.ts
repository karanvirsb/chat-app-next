import { getAnUser } from ".";
import makeSupertokenDb, {
    IMakeSupertokensDb,
} from "../../../../supertokens/data-access/supertokens-db";
import { clearDb, closeDb } from "../../../../__test__/fixures/db";
import makeFakeUser from "../../../../__test__/fixures/user";
import { makeDb } from "../data-access";
import makeUsersDb, { IMakeUsersDb } from "../data-access/users-db";
import { addUser } from "../use-cases";

describe("Get user controller", () => {
    let usersDb: IMakeUsersDb["returnType"];
    let SupertokensDb: IMakeSupertokensDb["returnType"] = makeSupertokenDb({
        makeDb,
    });

    jest.setTimeout(30000);
    beforeAll(async () => {
        const createdUser = await SupertokensDb.addUser({
            user: {
                user_id: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
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
            userId: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
        });
        await closeDb();
    });

    it("successfully retrieve user", async () => {
        const fakeUser = await makeFakeUser({
            userId: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
        });
        const resp = await addUser(fakeUser);
        const user = await getAnUser({
            body: {},
            headers: {},
            ip: "string",
            method: "GET",
            params: { id: "5c0fc896-1af1-4c26-b917-550ac5eefa9e" },
            path: "",
            query: {},
        });
        console.log(user);
        expect(user.body.data.username).toBe(fakeUser.username);
    });
});
