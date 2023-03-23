import { moderateName } from "../../../Utilities/moderateText";
import makeGroupDb from "../data-access/group-db";
import makeDb, { clearDb, closeDb } from "../../../../__test__/fixures/db";
import makeFakeGroup from "../../../../__test__/fixures/group";
import inviteCodeGenerator from "../../../Utilities/inviteCodeGenerator";
import makeAddGroup from "./addGroup";
import makeUpdateInviteCode from "./updateInviteCode";
import supertokens from "../../../../supertokens";
import makeSupertokenDb from "../../../../supertokens/data-access/supertokens-db";
import makeUsersDb from "../../user/data-access/users-db";

const handleModeration = async (name: string) => {
    return await moderateName(name);
};

describe("Updating invite code of group use case", () => {
    jest.setTimeout(15000);
    let groupDb = makeGroupDb({ makeDb });
    let addGroup = makeAddGroup({ groupDb, handleModeration });
    const updateInviteCode = makeUpdateInviteCode({
        groupDb,
        inviteCodeGenerator,
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

    test("SUCCESS: update invite code", async () => {
        const group = await makeFakeGroup();
        console.log(group);
        const res = await addGroup(
            group,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );

        const updatedGroup = await updateInviteCode(group.groupId);

        expect(updatedGroup.data?.inviteCode).not.toEqual(group.inviteCode);
    });

    test("ERROR: update invite code group id not given", async () => {
        let group = await makeFakeGroup();
        const addedGroup = await addGroup(
            group,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );
        try {
            const groupErr = await updateInviteCode("");
        } catch (err) {
            if (err instanceof Error)
                expect(err.message).toBe("Group Id needs to be supplied");
        }
    });
});
