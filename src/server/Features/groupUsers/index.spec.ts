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
    try {
      buildGroupUser(userWithoutgId);
    } catch (error) {
      expect((error as ZodError<IGroupUser>).format().gId?._errors[0]).toBe(
        "String must contain at least 21 character(s)"
      );
    }
  });
  it("ERROR: uId needs to exist", () => {
    const userWithoutuId = structuredClone(fakeGroupUser);
    userWithoutuId.uId = "";
    try {
      buildGroupUser(userWithoutuId);
    } catch (error) {
      expect((error as ZodError<IGroupUser>).format().uId?._errors[0]).toBe(
        "String must contain at least 21 character(s)"
      );
    }
  });
  it("ERROR: roles needs to exist", () => {
    const userWithoutRoles = structuredClone(fakeGroupUser);
    userWithoutRoles.roles = [];
    try {
      buildGroupUser(userWithoutRoles);
    } catch (error) {
      expect((error as ZodError<IGroupUser>).format().roles?._errors[0]).toBe(
        "Array must contain at least 1 element(s)"
      );
    }
  });
});
