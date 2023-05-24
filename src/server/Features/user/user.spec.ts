import Id from "../../Utilities/id";
import buildUser from ".";
import { IUser } from "./user";

describe("user", () => {
  const tempUser: IUser = {
    userId: Id.makeId(),
    username: "John123",
    status: "offline",
    password: Id.makeId(),
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
    expect(() => buildUser({ ...tempUser, status: "online" })).toThrow(
      "Must have a valid status"
    );
  });

  // it("User is deleted name changes", () => {
  //   const user = buildUser({ ...tempUser });
  //   if (user.success) {
  //     user.data.markedDeleted();
  //   }

  //   expect(user.getUsername()).toBe("Deleted :`(");
  // });
});
