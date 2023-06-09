import makeDb from "@/server/__test__/fixures/db";
import makeFakeFriends from "@/server/__test__/fixures/friends";
import userTests from "@/server/__test__/functions/user";

import makeFriendsDb from "../data-access/friends-db";
import makeAddFriend from "./addFriend";
import makeGetFriends from "./getFriends";

describe("Getting friends use case", () => {
  const friendsDb = makeFriendsDb({ makeDb });
  const addFriend = makeAddFriend({ friendsDb });
  const getFriends = makeGetFriends({ friendsDb });

  const users = [
    "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
    "312c0878-04c3-4585-835e-c66900ccc7a1",
    "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc",
    "3443c648-3323-4d6b-8830-c8a1b66a043a",
  ];
  beforeAll(async () => {
    await userTests.addTestUserToDB({ userId: users[0] });
    await userTests.addTestUserToDB({ userId: users[1] });
    await userTests.addTestUserToDB({ userId: users[2] });
    await userTests.addTestUserToDB({ userId: users[3] });
  });

  afterEach(async () => {
    // TODO await clearDb("friends");
  });
  afterAll(async () => {
    // TODO await clearDb("friends");

    await userTests.addTestUserToDB({
      userId: users[0],
    });
    await userTests.addTestUserToDB({
      userId: users[1],
    });
    await userTests.addTestUserToDB({
      userId: users[2],
    });
    await userTests.addTestUserToDB({
      userId: users[3],
    });
  });

  // TODO
  test.skip("SUCCESS: getting friends", async () => {
    await addFriend(
      "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
      "312c0878-04c3-4585-835e-c66900ccc7a1"
    );

    await addFriend(
      "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
      "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
    );

    const lastFriend = await addFriend(
      "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
      "3443c648-3323-4d6b-8830-c8a1b66a043a"
    );

    const foundFriends = await getFriends(
      "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
    );
    console.log(foundFriends);
    if (foundFriends.data)
      expect(foundFriends.data[foundFriends.data.length - 1].friendId).toBe(
        lastFriend.data?.friendId
      );
  });

  test("ERROR: missing user id", async () => {
    const fakeFriends = await makeFakeFriends(
      "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
      "312c0878-04c3-4585-835e-c66900ccc7a1"
    );
    try {
      await addFriend(fakeFriends.userId, fakeFriends.friendId);

      await getFriends("");
    } catch (error) {
      if (error instanceof Error)
        expect(error.message).toBe("User Id needs to be supplied.");
    }
  });
});
