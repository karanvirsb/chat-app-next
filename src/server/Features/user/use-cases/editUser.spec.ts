import makeEditUser from "./editUser";
import { moderateName } from "../../../Utilities/moderateText";
import makeDb, { clearDb, closeDb } from "../../../../__test__/fixures/db";
import makeUsersDb from "../data-access/users-db";
import makeFakeUser from "../../../../__test__/fixures/user";
import makeSupertokenDb, {
    IMakeSupertokensDb,
} from "../../../../supertokens/data-access/supertokens-db";

const handleModeration = async (name: string) => {
    return await moderateName(name);
};
describe("Edit Users use case", () => {
    jest.setTimeout(50000);
    let usersDb = makeUsersDb({ makeDb });
    let editUser = makeEditUser({ usersDb, handleModeration });

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

    jest.setTimeout(50000);
    afterAll(async () => {
        const deletedUser = await SupertokensDb.deleteUser({
            userId: "12345678910",
        });
        await closeDb();
    });

    it("Error: User id must be passed", async () => {
        expect(
            editUser({ userId: "", updates: { userId: "e" } })
        ).rejects.toThrow("An userId must be passed");
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
            expect(updatedUser.error).toBe(
                "Could not find any user with that id"
            );
        }
    });
});
