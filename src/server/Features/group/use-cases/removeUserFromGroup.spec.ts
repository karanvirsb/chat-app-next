import { moderateName } from "../../../Utilities/moderateText";
import makeGroupDb from "../data-access/group-db";
import makeDb, { clearDb, closeDb } from "../../../../__test__/fixures/db";
import makeFakeGroup from "../../../../__test__/fixures/group";
import makeAddGroup from "./addGroup";
import makeRemoveUserFromGroup from "./removeUserFromGroup";
import supertokens from "../../../../supertokens";
import makeSupertokenDb from "../../../../supertokens/data-access/supertokens-db";
import makeUsersDb from "../../user/data-access/users-db";

const handleModeration = async (name: string) => {
    return await moderateName(name);
};

describe("Removing user from a group use case", () => {
    jest.setTimeout(15000);
    let groupDb = makeGroupDb({ makeDb });
    let addGroup = makeAddGroup({ groupDb, handleModeration });
    const removeUserFromGroup = makeRemoveUserFromGroup({ groupDb });

    let SupertokensDb = makeSupertokenDb({ makeDb });
    beforeAll(async () => {
        // creating user if it does not exist
        const userDb = makeUsersDb({ makeDb });
        const foundUser = await userDb.findById({
            id: "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc",
        });

        // if user does not exist create
        if (!foundUser.success || !foundUser.data) {
            const addedUser = await SupertokensDb.addUser({
                user: {
                    user_id: "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc",
                    email: "anTest@gmai.com",
                    password: "123",
                    time_joined: Date.now(),
                },
            });
            if (addedUser.success && addedUser.data) {
                const addUser = await userDb.insert({
                    data: {
                        userId: addedUser.data.user_id,
                        status: "online",
                        username: "testering",
                    },
                });
            }
        }
    });

    afterAll(async () => {
        await clearDb("groupt");
        await clearDb('"groupUsers"');
        await SupertokensDb.deleteUser({
            userId: "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc",
        });
        await closeDb();
    });

    test("SUCCESS: remove user from group", async () => {
        const group = await makeFakeGroup();
        const res = await addGroup(
            group,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );

        const removedUser = await removeUserFromGroup(
            group.groupId,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );

        expect(removedUser.data?.uId).toBe(
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );
    });

    test("ERROR: removing user from a group but no group id", async () => {
        let group = await makeFakeGroup();
        const addedGroup = await addGroup(
            group,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );
        try {
            const groupErr = await removeUserFromGroup(
                "",
                "3443c648-3323-4d6b-8830-c8a1b66a043a"
            );
        } catch (err) {
            if (err instanceof Error)
                expect(err.message).toBe("Group Id needs to be supplied");
        }
    });

    test("ERROR: removing user from a group but no user id is provided", async () => {
        let group = await makeFakeGroup();
        const addedGroup = await addGroup(
            group,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );
        try {
            const groupErr = await removeUserFromGroup(group.groupId, "");
        } catch (err) {
            if (err instanceof Error) {
                console.log(err.message);
                expect(err.message).toBe("User Id needs to be supplied");
            }
        }
    });
});
