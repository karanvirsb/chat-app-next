import makeGroupDb from "../data-access/group-db";
import makeDb, { clearDb, closeDb } from "../../../../__test__/fixures/db";
import makeAddGroup from "../use-cases/addGroup";
import { moderateName } from "../../../Utilities/moderateText";
import makeFakeGroup from "../../../../__test__/fixures/group";
import makeUpdateGroupNameController from "./update-groupName";
import makeUpdateGroupName from "../use-cases/updateGroupName";
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

describe("Update group name controller", () => {
    // const groupRequest = {
    //     body: {},
    //     headers: {},
    //     ip: "",
    //     method: "",
    //     params: {},
    //     path: "",
    //     query: {},
    // };

    const groupDb = makeGroupDb({ makeDb });
    const addGroup = makeAddGroup({ groupDb, handleModeration });
    const updateGroupName = makeUpdateGroupName({
        groupDb,
        handleModeration,
        sanitizeName: sanitizeText,
    });
    const updateGroupNameController = makeUpdateGroupNameController({
        updateGroupName,
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

    afterAll(async () => {
        await clearDb("groupt");
        await clearDb('"groupUsers"');
        await SupertokensDb.deleteUser({
            userId: "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc",
        });
        await closeDb();
    });

    test("SUCCESS: update group name", async () => {
        const group = await makeFakeGroup();
        const addedGroup = await addGroup(
            group,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );
        const groupRequest = {
            body: {
                groupId: group.groupId,
                newGroupName: "Coders",
            },
            headers: { "Content-Type": "application/json" },
            ip: "",
            method: "POST",
            params: {},
            path: "",
            query: {},
        };

        const updatedGroup = await updateGroupNameController(groupRequest);
        expect(updatedGroup.body.data?.groupName).toBe("Coders");
    });

    test("ERROR: group id was not given for updateGroupNameController", async () => {
        const group = await makeFakeGroup();
        const addedGroup = await addGroup(
            group,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );
        const groupRequest = {
            body: {
                groupId: "",
                newGroupName: "Coders",
            },
            headers: { "Content-Type": "application/json" },
            ip: "",
            method: "POST",
            params: {},
            path: "",
            query: {},
        };

        const updatedGroup = await updateGroupNameController(groupRequest);

        expect(updatedGroup.statusCode).toBe(400);
        expect(updatedGroup.body.error).toBe("Group id needs to be supplied");
    });

    test("ERROR: group name was not given for updateGroupNameController", async () => {
        const group = await makeFakeGroup();
        const addedGroup = await addGroup(
            group,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );
        const groupRequest = {
            body: {
                groupId: group.groupId,
                newGroupName: "",
            },
            headers: { "Content-Type": "application/json" },
            ip: "",
            method: "POST",
            params: {},
            path: "",
            query: {},
        };

        const updatedGroup = await updateGroupNameController(groupRequest);

        expect(updatedGroup.statusCode).toBe(400);
        expect(updatedGroup.body.error).toBe(
            "A new group name must be supplied"
        );
    });

    test("ERROR: contains profanity:  updateGroupNameController", async () => {
        const group = await makeFakeGroup();
        const addedGroup = await addGroup(
            group,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );
        const groupRequest = {
            body: {
                groupId: group.groupId,
                newGroupName: "bullshit",
            },
            headers: { "Content-Type": "application/json" },
            ip: "",
            method: "POST",
            params: {},
            path: "",
            query: {},
        };

        const updatedGroup = await updateGroupNameController(groupRequest);

        expect(updatedGroup.body.error).toBe("Group name contains profanity");
    });

    test("ERROR: contains html:  updateGroupNameController", async () => {
        const group = await makeFakeGroup();
        const addedGroup = await addGroup(
            group,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );
        const groupRequest = {
            body: {
                groupId: group.groupId,
                newGroupName: "<html></html>",
            },
            headers: { "Content-Type": "application/json" },
            ip: "",
            method: "POST",
            params: {},
            path: "",
            query: {},
        };

        const updatedGroup = await updateGroupNameController(groupRequest);

        expect(updatedGroup.body.error).toBe(
            "Group name must contain valid characters"
        );
    });

    test("ERROR: name needs to be between 3 to 50 characters:  updateGroupNameController", async () => {
        const group = await makeFakeGroup();
        const addedGroup = await addGroup(
            group,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );
        const groupRequest = {
            body: {
                groupId: group.groupId,
                newGroupName: "12",
            },
            headers: { "Content-Type": "application/json" },
            ip: "",
            method: "POST",
            params: {},
            path: "",
            query: {},
        };

        const updatedGroup = await updateGroupNameController(groupRequest);

        expect(updatedGroup.body.error).toBe(
            "Group name must be between 3 and 50 characters long"
        );
    });
});
