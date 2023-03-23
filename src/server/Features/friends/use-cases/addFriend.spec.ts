import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeFakeFriends from "../../../../__test__/fixures/friends";
import userTests from "../../../../__test__/functions/user";
import makeFriendsDb from "../data-access/friends-db";
import makeAddFriend from "./addFriend";

describe("Add friend use case", () => {
    const friendsDb = makeFriendsDb({ makeDb });
    const addFriend = makeAddFriend({ friendsDb });

    jest.setTimeout(30000);
    const users = [
        "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
        "312c0878-04c3-4585-835e-c66900ccc7a1",
        "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc",
    ];
    beforeAll(async () => {
        const fakeUser = await userTests.addTestUserToDB({ userId: users[0] });
        const fakeUser1 = await userTests.addTestUserToDB({ userId: users[1] });
        const fakeUser2 = await userTests.addTestUserToDB({ userId: users[2] });
    });

    afterAll(async () => {
        await clearDb("friends");

        const deletedFakeUser = await userTests.addTestUserToDB({
            userId: users[0],
        });
        const deletedFakeUser1 = await userTests.addTestUserToDB({
            userId: users[1],
        });
        const deletedFakeUser2 = await userTests.addTestUserToDB({
            userId: users[2],
        });
    });

    test("SUCCESS: adding friends", async () => {
        const fakeFriends = await makeFakeFriends(
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
            "312c0878-04c3-4585-835e-c66900ccc7a1"
        );
        const friends = await addFriend(
            fakeFriends.userId,
            fakeFriends.friendId
        );

        expect(friends.data?.userId).toBe(fakeFriends.userId);
    });

    test("ERROR: missing user id", async () => {
        const fakeFriends = await makeFakeFriends(
            "",
            "312c0878-04c3-4585-835e-c66900ccc7a1"
        );
        try {
            const friends = await addFriend(
                fakeFriends.userId,
                fakeFriends.friendId
            );
        } catch (error) {
            if (error instanceof Error)
                expect(error.message).toBe("User Id needs to be supplied");
        }
    });

    test("ERROR: missing Friend id", async () => {
        const fakeFriends = await makeFakeFriends("123", "");
        try {
            const friends = await addFriend(
                fakeFriends.userId,
                fakeFriends.friendId
            );
        } catch (error) {
            if (error instanceof Error)
                expect(error.message).toBe("Friends Id needs to be supplied");
        }
    });
});
