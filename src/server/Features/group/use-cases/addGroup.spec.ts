import { moderateName } from "../../../Utilities/moderateText";
import makeGroupDb from "../data-access/group-db";
import makeDb, { clearDb, closeDb } from "../../../../__test__/fixures/db";
import makeFakeGroup from "../../../../__test__/fixures/group";
import makeAddGroup from "./addGroup";
import makeUsersDb from "../../user/data-access/users-db";
import makeSupertokenDb from "../../../../supertokens/data-access/supertokens-db";
import supertokens from "../../../../supertokens";

const handleModeration = async (name: string) => {
    return await moderateName(name);
};

describe("Adding group use case", () => {
    let groupDb = makeGroupDb({ makeDb });
    let addGroup = makeAddGroup({ groupDb, handleModeration });
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

    test("Successfully insert group use case", async () => {
        const group = await makeFakeGroup();
        const res = await addGroup(
            group,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );
        console.log(res, group);
        if (res.success) {
            expect(res.data?.groupName).toBe(group.groupName);
        }
    });

    test("Duplicate group insert", async () => {
        const group = await makeFakeGroup();
        const res = await addGroup(
            group,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );
        if (res.success) {
            const err = await addGroup(
                group,
                "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
            );
            expect(err.error).toBe("Group already exists");
        }
    });

    test("Group name contains profanity", async () => {
        const group = await makeFakeGroup();
        group["groupName"] = "bullshit";
        try {
            const res = await addGroup(
                group,
                "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
            );
        } catch (error) {
            if (error instanceof Error)
                expect(error.message).toBe("Group name contains profanity");
        }
    });
});
