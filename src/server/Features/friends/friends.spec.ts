import buildFriends from ".";

describe("Friends test", () => {
    test("SUCCESS: created friends successfully", () => {
        expect(() =>
            buildFriends({
                userId: "123",
                friendId: "123",
                dateAdded: new Date(),
            })
        ).not.toThrow();
    });

    test("ERROR: user id does not exist", () => {
        expect(() =>
            buildFriends({ userId: "", friendId: "123", dateAdded: new Date() })
        ).toThrow("User Id needs to be supplied");
    });

    test("ERROR: friends id does not exist", () => {
        expect(() =>
            buildFriends({
                userId: "123",
                friendId: "",
                dateAdded: new Date(),
            })
        ).toThrow("Friends Id needs to be supplied");
    });
});
