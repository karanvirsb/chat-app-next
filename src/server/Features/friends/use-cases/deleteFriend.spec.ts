import makeDb from "@/server/__test__/fixures/db";
import makeFakeFriends from "@/server/__test__/fixures/friends";
import userTests from "@/server/__test__/functions/user";

import makeFriendsDb from "../data-access/friends-db";
import { IFriends } from "../friends";
import makeAddFriend from "./addFriend";
import makeDeleteFriend from "./deleteFriend";

describe("Delete friend use case", () => {
  const friendsDb = makeFriendsDb({ makeDb });
  const addFriend = makeAddFriend({ friendsDb });
  const deleteFriends = makeDeleteFriend({ friendsDb });

  visetTimeout(30000);
  const users = [
    "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
    "312c0878-04c3-4585-835e-c66900ccc7a1",
    "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc",
  ];

  let fakeFriends: IFriends;

  beforeAll(async () => {
    await userTests.addTestUserToDB({ userId: users[0] });
    await userTests.addTestUserToDB({ userId: users[1] });
    await userTests.addTestUserToDB({ userId: users[2] });
  });

  beforeEach(async () => {
    fakeFriends = await makeFakeFriends(
      "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
      "312c0878-04c3-4585-835e-c66900ccc7a1"
    );
  });

  afterEach(async () => {
    await deleteFriends(
      "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
      "312c0878-04c3-4585-835e-c66900ccc7a1"
    );
  });

  afterAll(async () => {
    await userTests.addTestUserToDB({
      userId: users[0],
    });
    await userTests.addTestUserToDB({
      userId: users[1],
    });
    await userTests.addTestUserToDB({
      userId: users[2],
    });
  });

  test("SUCCESS: Deleting friends", async () => {
    await addFriend(fakeFriends.userId, fakeFriends.friendId);

    const deletedFriend = await deleteFriends(
      fakeFriends.userId,
      fakeFriends.friendId
    );

    expect(deletedFriend.data?.userId).toBe(fakeFriends.userId);
  });

  test("ERROR: missing user id", async () => {
    await addFriend(fakeFriends.userId, fakeFriends.friendId);
    try {
      await deleteFriends("", "312c0878-04c3-4585-835e-c66900ccc7a1");
    } catch (error) {
      if (error instanceof Error)
        expect(error.message).toBe("User Id needs to be supplied.");
    }
  });

  test("ERROR: missing Friend id", async () => {
    try {
      await deleteFriends("5c0fc896-1af1-4c26-b917-550ac5eefa9e", "");
    } catch (error) {
      if (error instanceof Error)
        expect(error.message).toBe("Friends Id needs to be supplied.");
    }
  });
});
