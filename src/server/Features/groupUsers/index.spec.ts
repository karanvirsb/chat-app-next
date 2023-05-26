import { ZodError } from "zod";

import id from "../../Utilities/id";
import buildGroupUser from ".";
import { IGroupUser } from "./groupUsers";

describe("Testing group user", () => {
  const uuid = id.makeId();
  const fakeGroupUser: IGroupUser = {
    gId: uuid,
    lastChecked: new Date(),
    roles: ["2000"],
    uId: uuid,
  };
  it("SUCCESS: group user created", () => {
    const user = buildGroupUser(fakeGroupUser);
    if (user.success) {
      expect(user.data.getUId()).toBe(fakeGroupUser.uId);
      expect(user.data.getGId()).toBe(fakeGroupUser.gId);
    }
  });
  it("ERROR: gId needs to exist", () => {
    const userWithoutgId = structuredClone(fakeGroupUser);
    userWithoutgId.gId = "";

    const result = buildGroupUser(userWithoutgId);
    expect(result.success).toBeFalsy();
    if (!result.success) {
      expect(result.error).toBeInstanceOf(ZodError);
      if (result.error instanceof ZodError) {
        const err = (result.error as ZodError<IGroupUser>).flatten()
          .fieldErrors;
        console.log(err);
        expect(err.gId?.join("")).toBe("Invalid uuid");
      }
    }
  });
  it("ERROR: uId needs to exist", () => {
    const userWithoutuId = structuredClone(fakeGroupUser);
    userWithoutuId.uId = "";

    const result = buildGroupUser(userWithoutuId);
    expect(result.success).toBeFalsy();
    if (!result.success) {
      expect(result.error).toBeInstanceOf(ZodError);
      if (result.error instanceof ZodError) {
        const err = (result.error as ZodError<IGroupUser>).flatten()
          .fieldErrors;
        console.log(err);
        expect(err.uId?.join("")).toBe("Invalid uuid");
      }
    }
  });
  it("ERROR: roles needs to exist", () => {
    const userWithoutRoles = structuredClone(fakeGroupUser);
    userWithoutRoles.roles = [];
    const result = buildGroupUser(userWithoutRoles);
    expect(result.success).toBeFalsy();
    if (!result.success) {
      expect(result.error).toBeInstanceOf(ZodError);
      if (result.error instanceof ZodError) {
        const err = (result.error as ZodError<IGroupUser>).flatten()
          .fieldErrors;
        console.log(err);
        expect(err.roles?.join("")).toBe(
          "Array must contain at least 1 element(s)"
        );
      }
    }
  });
});
