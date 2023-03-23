import makeGroupDb from "../data-access/group-db";
import makeDb, { clearDb, closeDb } from "../../../../__test__/fixures/db";
import makeAddGroupController from "./add-group";
import makeAddGroup from "../use-cases/addGroup";
import { moderateName } from "../../../Utilities/moderateText";
import makeFakeGroup from "../../../../__test__/fixures/group";
import supertokens from "../../../../supertokens";
import makeSupertokenDb from "../../../../supertokens/data-access/supertokens-db";
import makeUsersDb from "../../user/data-access/users-db";

const handleModeration = async (name: string) => {
    return await moderateName(name);
};

describe("Add group controller", () => {
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
    const addGroupController = makeAddGroupController({ addGroup });

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

    test("SUCCESS: add group to the database", async () => {
        const group = await makeFakeGroup();
        const groupRequest = {
            body: {
                groupInfo: group,
                userId: "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc",
            },
            headers: { "Content-Type": "application/json" },
            ip: "",
            method: "POST",
            params: {},
            path: "",
            query: {},
        };

        const addedGroup = await addGroupController(groupRequest);
        expect(addedGroup.body.data?.groupId).toBe(group.groupId);
    });

    test("ERROR: user Id was not given", async () => {
        const group = await makeFakeGroup();
        const groupRequest = {
            body: {
                groupInfo: group,
                userId: "",
            },
            headers: { "Content-Type": "application/json" },
            ip: "",
            method: "POST",
            params: {},
            path: "",
            query: {},
        };

        const addedGroup = await addGroupController(groupRequest);

        expect(addedGroup.statusCode).toBe(400);
        expect(addedGroup.body.error).toBe("User id needs to be supplied");
    });
});
