import { editAnUser } from ".";
import makeSupertokenDb, {
    IMakeSupertokensDb,
} from "../../../../supertokens/data-access/supertokens-db";
import { clearDb, closeDb } from "../../../../__test__/fixures/db";
import makeFakeUser from "../../../../__test__/fixures/user";
import { makeDb } from "../data-access";
import makeUsersDb, { IMakeUsersDb } from "../data-access/users-db";
import { addUser } from "../use-cases";

describe("Edit user controller", () => {
    let usersDb: IMakeUsersDb["returnType"];
    let SupertokensDb: IMakeSupertokensDb["returnType"] = makeSupertokenDb({
        makeDb,
    });

    jest.setTimeout(30000);
    beforeAll(async () => {
        const createdUser = await SupertokensDb.addUser({
            user: {
                user_id: "312c0878-04c3-4585-835e-c66900ccc7a1",
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
            userId: "312c0878-04c3-4585-835e-c66900ccc7a1",
        });
        await closeDb();
    });

    it("edit user ", async () => {
        const user = await makeFakeUser({
            userId: "312c0878-04c3-4585-835e-c66900ccc7a1",
        });
        const resp = await addUser(user);
        const edittedUser = await editAnUser({
            body: {
                id: "312c0878-04c3-4585-835e-c66900ccc7a1",
                updates: { status: "offline" },
            },
            headers: {},
            ip: "string",
            method: "GET",
            params: {},
            path: "",
            query: {},
        });

        console.log(edittedUser);
        expect(edittedUser.body.data.status).toBe("offline");
    });
});
