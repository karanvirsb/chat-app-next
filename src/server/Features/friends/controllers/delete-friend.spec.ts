import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeAddFriend from "../use-cases/addFriend";
import makeAddFriendController from "./add-friends";
import makeFakeFriends from "../../../../__test__/fixures/friends";
import makeFriendsDb from "../data-access/friends-db";
import makeDeleteFriend from "../use-cases/deleteFriend";
import makeDeleteFriendController from "./delete-friend";
import userTests from "../../../../__test__/functions/user";

describe("Deleting friend controller", () => {
    const friendsDb = makeFriendsDb({ makeDb });
    const addFriend = makeAddFriend({ friendsDb });
    const deleteFriend = makeDeleteFriend({ friendsDb });
    const deleteFriendController = makeDeleteFriendController({ deleteFriend });

    jest.setTimeout(30000);
    const users = [
        "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
        "312c0878-04c3-4585-835e-c66900ccc7a1",
        "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc",
        "3443c648-3323-4d6b-8830-c8a1b66a043a",
    ];
    beforeAll(async () => {
        const fakeUser = await userTests.addTestUserToDB({ userId: users[0] });
        const fakeUser1 = await userTests.addTestUserToDB({ userId: users[1] });
        const fakeUser2 = await userTests.addTestUserToDB({ userId: users[2] });
        const fakeUser3 = await userTests.addTestUserToDB({ userId: users[3] });
    });

    afterEach(async () => {
        await clearDb("friends");
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
        const deletedFakeUser3 = await userTests.addTestUserToDB({
            userId: users[3],
        });
    });

    test("SUCCESS: deleting friend", async () => {
        const friend = await makeFakeFriends(
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
            "312c0878-04c3-4585-835e-c66900ccc7a1"
        );

        const friendRequest = {
            body: { userId: friend.userId, friendId: friend.friendId },
            headers: {},
            ip: "",
            method: "POST",
            params: {},
            path: "",
            query: {},
        };

        const addedFriend = await addFriend(friend.userId, friend.friendId);
        const deletedFriend = await deleteFriendController(friendRequest);
        expect(deletedFriend.body.data?.userId).toBe(friend.userId);
    });

    test("ERROR: user id missing", async () => {
        const friend = await makeFakeFriends(
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
            "312c0878-04c3-4585-835e-c66900ccc7a1"
        );

        const friendRequest = {
            body: { userId: "", friendId: friend.friendId },
            headers: {},
            ip: "",
            method: "POST",
            params: {},
            path: "",
            query: {},
        };

        const addedFriend = await addFriend(friend.userId, friend.friendId);
        const deletedFriend = await deleteFriendController(friendRequest);

        expect(deletedFriend.body.error).toBe("User Id needs to be supplied.");
    });

    test("ERROR: friend id missing", async () => {
        const friend = await makeFakeFriends(
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
            "312c0878-04c3-4585-835e-c66900ccc7a1"
        );

        const friendRequest = {
            body: { userId: friend.userId, friendId: "" },
            headers: {},
            ip: "",
            method: "POST",
            params: {},
            path: "",
            query: {},
        };

        const addedFriend = await addFriend(friend.userId, friend.friendId);
        const deletedFriend = await deleteFriendController(friendRequest);

        expect(deletedFriend.body.error).toBe(
            "Friends Id needs to be supplied."
        );
    });
});
