import Id from "../../Utilities/id";
import buildUser from ".";
import { IUser } from "./user";

describe("user", () => {
  const tempUser: IUser = {
    userId: Id.makeId(),
    username: "John123",
    status: "offline",
    password: "John_123",
  };
  it("User id has to be valid", () => {
    const result = buildUser({ ...tempUser, userId: "" });
    expect(result.success).toBeFalsy();
  });
  it("Have to have username greater than 3 letters", () => {
    const result = buildUser({ ...tempUser, username: "wq" });
    expect(result.success).toBeFalsy();
  });

  it("Username contains html", () => {
    const result = buildUser({
      ...tempUser,
      username: "<img src=x onerror=alert('img') />",
    });
    expect(result.success).toBeFalsy();
  });

  it("Must have a status", () => {
    const result = buildUser({ ...tempUser, status: "online" });
    expect(result.success).toBeFalsy();
  });

  // it("User is deleted name changes", () => {
  //   const user = buildUser({ ...tempUser });
  //   if (user.success) {
  //     user.data.markedDeleted();
  //   }

  //   expect(user.getUsername()).toBe("Deleted :`(");
  // });
});
