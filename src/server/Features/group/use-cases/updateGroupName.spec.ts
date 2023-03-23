import { moderateName } from "../../../Utilities/moderateText";
import makeGroupDb from "../data-access/group-db";
import makeDb, { clearDb, closeDb } from "../../../../__test__/fixures/db";
import makeFakeGroup from "../../../../__test__/fixures/group";
import makeAddGroup from "./addGroup";
import makeUpdateGroupName from "./updateGroupName";
import sanitizeHtml from "sanitize-html";
import supertokens from "../../../../supertokens";
import makeSupertokenDb from "../../../../supertokens/data-access/supertokens-db";
import makeUsersDb from "../../user/data-access/users-db";

const handleModeration = async (name: string) => {
    return await moderateName(name);
};

function sanitizeText(text: string) {
    return sanitizeHtml(text);
}

describe("Updating group name use case", () => {
    jest.setTimeout(15000);
    let groupDb = makeGroupDb({ makeDb });
    let addGroup = makeAddGroup({ groupDb, handleModeration });
    const updateGroupName = makeUpdateGroupName({
        groupDb,
        handleModeration,
        sanitizeName: sanitizeText,
    });

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
    afterEach(async () => {
        await clearDb("groupt");
        await clearDb('"groupUsers"');
    });
    afterAll(async () => {
        await clearDb("groupt");
        await clearDb('"groupUsers"');
        await SupertokensDb.deleteUser({
            userId: "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc",
        });
        await closeDb();
    });

    test("Update group name success", async () => {
        const group = await makeFakeGroup();
        const res = await addGroup(
            group,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );

        if (res.success) {
            const updatedGroup = await updateGroupName(group.groupId, "Coders");
            expect(updatedGroup.data?.groupName).toBe("Coders");
        }
    });

    test("ERROR: Update group name no group id", async () => {
        const group = await makeFakeGroup();
        const res = await addGroup(
            group,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );

        try {
            const updatedGroup = await updateGroupName("", "Coders");
        } catch (error) {
            if (error instanceof Error)
                expect(error.message).toBe("Group id needs to be supplied");
        }
    });

    test("ERROR: Update group name no new group name", async () => {
        const group = await makeFakeGroup();
        const res = await addGroup(
            group,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );

        try {
            const updatedGroup = await updateGroupName(group.groupId, "");
        } catch (error) {
            if (error instanceof Error)
                expect(error.message).toBe("A new group name must be supplied");
        }
    });

    test("ERROR: Update group name contains profanity", async () => {
        const group = await makeFakeGroup();
        const res = await addGroup(
            group,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );

        try {
            const updatedGroup = await updateGroupName(
                group.groupId,
                "bullshit"
            );
        } catch (error) {
            console.log((error as Error).message);
            if (error instanceof Error) {
                expect(error.message).toBe("Group name contains profanity");
            }
        }
    });

    test("ERROR: Update group name contains html", async () => {
        const group = await makeFakeGroup();
        const res = await addGroup(
            group,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );

        try {
            const updatedGroup = await updateGroupName(
                group.groupId,
                "<html>n</html>"
            );
        } catch (error) {
            if (error instanceof Error)
                expect(error.message).toBe(
                    "Group name must contain valid characters"
                );
        }
    });

    test("ERROR: Update group name must be between 3 - 50 characters", async () => {
        const group = await makeFakeGroup();
        const res = await addGroup(
            group,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );

        try {
            const updatedGroup = await updateGroupName(
                group.groupId,
                "123456789012345678901234567890123456789012345678901234567890"
            );
        } catch (error) {
            if (error instanceof Error)
                expect(error.message).toBe(
                    "Group name must be between 3 and 50 characters long"
                );
        }
    });
});
