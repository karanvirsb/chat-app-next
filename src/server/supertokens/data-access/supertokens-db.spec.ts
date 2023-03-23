import makeSupertokenDb, { IMakeSupertokensDb } from "./supertokens-db";
import makeDb from "../../__test__/fixures/db";
import { deleteUser } from "supertokens-node";

describe("Supertokens test", () => {
    test("adding user", async () => {
        let SupertokensDb: IMakeSupertokensDb["returnType"] = makeSupertokenDb({
            makeDb,
        });

        const user = {
            user_id: "123",
            email: "email.gmail.com",
            password: "123",
            time_joined: Date.now(),
        };

        const addedUser = await SupertokensDb.addUser({ user });

        if (addedUser.data && addedUser.success) {
            expect(addedUser.data.user_id.trim()).toBe(user.user_id);
            deleteUser("123");
        }
    });
});
