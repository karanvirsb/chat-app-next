import makeFriendsDb from "./friends-db";
import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import { IFriends } from "../friends";
import makeFakeFriends from "../../../../__test__/fixures/friends";
import userTests from "../../../../__test__/functions/user";

describe("friends DB testing", () => {
    const friendsDb = makeFriendsDb({ makeDb });

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

    test("SUCCESS: creating a friend", async () => {
        const friends = await makeFakeFriends(
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
            "312c0878-04c3-4585-835e-c66900ccc7a1"
        );

        const addedFriend = await friendsDb.addFriend(friends);

        expect(addedFriend.data?.userId).toBe(friends.userId);
    });

    test("SUCCESS: Deleted friend", async () => {
        const friends = await makeFakeFriends(
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
            "312c0878-04c3-4585-835e-c66900ccc7a1"
        );

        const addedFriend = await friendsDb.addFriend(friends);
        const deletedFriend = await friendsDb.deleteFriend(
            friends.userId,
            friends.friendId
        );

        expect(deletedFriend.data?.userId).toBe(friends.userId);
    });

    test("SUCCESS: getting a friend", async () => {
        const friends = await makeFakeFriends(
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
            "312c0878-04c3-4585-835e-c66900ccc7a1"
        );

        const addedFriend = await friendsDb.addFriend(friends);
        const foundAFriend = await friendsDb.getAFriend(
            friends.userId,
            friends.friendId
        );

        expect(foundAFriend.data?.userId).toBe(friends.userId);
    });

    test("Get friends", async () => {
        let friends = await makeFakeFriends(
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
            "312c0878-04c3-4585-835e-c66900ccc7a1"
        );

        let addFriends = await friendsDb.addFriend(friends);
        friends = await makeFakeFriends(
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );
        addFriends = await friendsDb.addFriend(friends);
        const allFriends = await friendsDb.getFriends(friends.userId);

        if (allFriends.data)
            expect(allFriends.data[allFriends.data?.length - 1].friendId).toBe(
                friends.friendId
            );
    });
});
