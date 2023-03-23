import { moderateName } from "../../../Utilities/moderateText";
import makeGroupDb from "../data-access/group-db";
import makeDb, { clearDb, closeDb } from "../../../../__test__/fixures/db";
import makeFakeGroup from "../../../../__test__/fixures/group";
import makeAddGroup from "./addGroup";
import makeDeleteGroup from "./deleteGroup";
import supertokens from "../../../../supertokens";
import makeUsersDb from "../../user/data-access/users-db";
import makeSupertokenDb from "../../../../supertokens/data-access/supertokens-db";

const handleModeration = async (name: string) => {
    return await moderateName(name);
};

describe("Deleting group use case", () => {
    let groupDb = makeGroupDb({ makeDb });
    let addGroup = makeAddGroup({ groupDb, handleModeration });
    const deleteGroup = makeDeleteGroup({ groupDb });
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

    test("SUCCESS: Delete group use case", async () => {
        const group = await makeFakeGroup();
        const res = await addGroup(
            group,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );

        const removedGroup = await deleteGroup(group.groupId);

        expect(removedGroup.data?.groupName).toBe(group.groupName);
    });

    test("ERROR: remove group but missing id", async () => {
        let group = await makeFakeGroup();
        const addedGroup = await addGroup(
            group,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );
        try {
            const groupErr = await deleteGroup("");
        } catch (err) {
            if (err instanceof Error)
                expect(err.message).toBe("Group Id needs to be supplied");
        }
    });
});
