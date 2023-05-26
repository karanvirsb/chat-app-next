import { ZodError } from "zod";

import Id from "../../Utilities/id";
import buildUser from ".";
import { IUser } from "./user";

describe("user", () => {
  const tempUser: IUser = {
    userId: Id.makeId(),
    username: "John123",
    status: "offline",
    password: "John-123",
  };
  it("User id has to be valid", () => {
    const result = buildUser({ ...tempUser, userId: "" });
    expect(result.success).toBeFalsy();

    if (!result.success) {
      expect(result.error).toBeInstanceOf(ZodError);
      if (result.error instanceof ZodError) {
        const err = (result.error as ZodError<IUser>).flatten().fieldErrors;

        expect(err.userId?.join("")).toBe("Invalid uuid");
      }
    }
  });
  it("Have to have username greater than 3 letters", () => {
    const result = buildUser({ ...tempUser, username: "wq" });
    expect(result.success).toBeFalsy();

    if (!result.success) {
      expect(result.error).toBeInstanceOf(ZodError);
      if (result.error instanceof ZodError) {
        const err = (result.error as ZodError<IUser>).flatten().fieldErrors;

        expect(err.username?.join("")).toBe(
          "Username must be atleast 3 characters long."
        );
      }
    }
  });

  it("Username contains html", () => {
    const result = buildUser({
      ...tempUser,
      username: "<img src=x onerror=alert('img') />",
    });
    expect(result.success).toBeFalsy();
    console.log(result);
    if (!result.success) {
      expect(result.error).toBeTypeOf("string");
      expect(result.error).toBe(
        "Username does not contain any valid characters."
      );
    }
  });
});
