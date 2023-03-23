import { deleteUser } from "supertokens-node";
import makeDb, { clearDb, closeDb } from "../../../../__test__/fixures/db";
import makeGroupDb, { IMakeGroupDb } from "./group-db";
import makeFakerGroup from "../../../../__test__/fixures/group";
import inviteCodeGenerator from "../../../Utilities/inviteCodeGenerator";
import makeUsersDb from "../../user/data-access/users-db";
import makeSupertokenDb, {
    IMakeSupertokensDb,
} from "../../../../supertokens/data-access/supertokens-db";
import supertokens from "../../../../supertokens";

describe("Group databse access", () => {
    let GroupDb: IMakeGroupDb["returnType"];
    let SupertokensDb: IMakeSupertokensDb["returnType"];

    beforeAll(async () => {
        jest.setTimeout(30000);
        GroupDb = makeGroupDb({ makeDb });
        SupertokensDb = makeSupertokenDb({ makeDb });

        // creating user if it does not exist
        const userDb = makeUsersDb({ makeDb });
        const foundUser = await userDb.findById({
            id: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
        });

        // if user does not exist create
        if (!foundUser.success || !foundUser.data) {
            const addedUser = await SupertokensDb.addUser({
                user: {
                    user_id: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
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
    });
    afterAll(async () => {
        await clearDb("groupt");
        await clearDb('"groupUsers"');
        await SupertokensDb.deleteUser({
            userId: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
        });
        await closeDb();
    });
    test("inserted group correctly", async () => {
        const group = await makeFakerGroup();

        const res = await GroupDb.createGroup(
            group,
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );

        expect(res.data?.groupId).toBe(group.groupId);
    });

    test("Find group by id", async () => {
        const group = await makeFakerGroup();

        const res = await GroupDb.createGroup(
            group,
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );

        const foundGroup = await GroupDb.findById(group.groupId);
        expect(foundGroup.data?.groupName).toBe(group.groupName);
    });

    test("updating group name", async () => {
        const group = await makeFakerGroup();

        const res = await GroupDb.createGroup(
            group,
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );

        const updatedGroup = await GroupDb.updateGroupName(
            group.groupId,
            "Coders"
        );

        expect(updatedGroup.data?.groupName).toBe("Coders");
    });

    test("deleting group", async () => {
        const group = await makeFakerGroup();

        const res = await GroupDb.createGroup(
            group,
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );

        const deletedGroup = await GroupDb.removeGroup(group.groupId);

        expect(deletedGroup.data?.groupName).toBe(group.groupName);
    });

    test("updating group invite code", async () => {
        const group = await makeFakerGroup();

        const res = await GroupDb.createGroup(
            group,
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );
        const newCode = inviteCodeGenerator.makeInviteCode();
        const updatedGroup = await GroupDb.updateInviteCode(
            group.groupId,
            newCode
        );

        expect(updatedGroup.data?.inviteCode).toBe(newCode);
    });

    test("Find group by invite code", async () => {
        const group = await makeFakerGroup();

        const res = await GroupDb.createGroup(
            group,
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );

        const foundGroup = await GroupDb.findByInviteCode(group.inviteCode);
        expect(foundGroup.data?.groupName).toBe(group.groupName);
    });

    test("Find users of group", async () => {
        const group = await makeFakerGroup();

        const res = await GroupDb.createGroup(
            group,
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );

        const users = await GroupDb.findUsersByGroupId(group.groupId);
        if (users.data)
            expect(users.data[0].userId).toBe(
                "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
            );
    });

    test("Adding user to group", async () => {
        const group = await makeFakerGroup();

        const res = await GroupDb.createGroup(
            group,
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );

        const addedUser = await GroupDb.addUserToGroup(
            group.groupId,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc",
            ["2001"]
        );

        expect(addedUser.data?.userId).toBe(
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );
    });

    test("Remove user from group", async () => {
        const group = await makeFakerGroup();

        const res = await GroupDb.createGroup(
            group,
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );

        const addedUser = await GroupDb.addUserToGroup(
            group.groupId,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc",
            ["2001"]
        );

        const deletedUser = await GroupDb.removeUserFromGroup(
            group.groupId,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );

        expect(deletedUser.data?.uId).toBe(
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );
    });
});
