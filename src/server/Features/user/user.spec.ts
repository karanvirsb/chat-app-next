import buildUser from ".";
import Id from "../../Utilities/id";

describe("user", () => {
    const tempUser = {
        userId: Id.makeId(),
        username: "John123",
        status: "offline",
    };
    it("User id has to be valid", () => {
        expect(() => buildUser({ ...tempUser, userId: "" })).toThrow(
            "User must have an Id greater than 10 characters"
        );
    });
    it("Have to have username greater than 3 letters", () => {
        expect(() => buildUser({ ...tempUser, username: "wq" })).toThrow(
            "Username must be greater than 3 characters but less than 30"
        );
    });

    it("Username contains html", () => {
        expect(() =>
            buildUser({
                ...tempUser,
                username: "<img src=x onerror=alert('img') />",
            })
        ).toThrow("Username does not contain any valid characters");
    });

    it("Must have a status", () => {
        expect(() => buildUser({ ...tempUser, status: "" })).toThrow(
            "Must have a valid status"
        );
    });

    it("User is deleted name changes", () => {
        const user = buildUser({ ...tempUser });
        user.markDeleted();

        expect(user.getUsername()).toBe("Deleted :`(");
    });
});
