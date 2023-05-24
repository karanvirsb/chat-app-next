import { ZodError } from "zod";

import id from "@/server/Utilities/id";

import buildGroup from ".";
import { IGroup } from "./group";

describe("Group creation test", () => {
  const group: IGroup = {
    groupId: id.makeId(),
    groupName: "Coders",
    inviteCode: "abcdefg",
    dateCreated: new Date(),
  };

  test("Group created successfully", () => {
    const result = buildGroup(group);
    expect(result.success).toBeTruthy();
  });

  test("Group name contains html", () => {
    const result = buildGroup({ ...group, groupName: "<html></html>" });
    expect(result.success).toBeFalsy();

    if (!result.success) {
      expect(result.error).toBeInstanceOf(ZodError);
      if (result.error instanceof ZodError) {
        const err = (result.error as ZodError<IGroup>).flatten().fieldErrors;
        console.log(err);
        expect(err.groupName?.join("")).toBe(
          "Group name must be at least 3 characters long"
        );
      }
    }
  });

  test("Group Name must be a certain length", () => {
    const result = buildGroup({ ...group, groupName: "bo" });
    expect(result.success).toBeFalsy();

    if (!result.success) {
      expect(result.error).toBeInstanceOf(ZodError);
      if (result.error instanceof ZodError) {
        const err = (result.error as ZodError<IGroup>).flatten().fieldErrors;
        console.log(err);
        expect(err.groupName?.join("")).toBe(
          "Group name must be at least 3 characters long"
        );
      }
    }
  });

  test("Group id is required", () => {
    const result = buildGroup({ ...group, groupId: "" });
    expect(result.success).toBeFalsy();

    if (!result.success) {
      expect(result.error).toBeInstanceOf(ZodError);
      if (result.error instanceof ZodError) {
        const err = (result.error as ZodError<IGroup>).flatten().fieldErrors;
        console.log(err);
        expect(err.groupId?.join("")).toBe("Invalid uuid");
      }
    }
  });

  test("Group requires an invite code", () => {
    const result = buildGroup({ ...group, inviteCode: "" });
    expect(result.success).toBeFalsy();

    if (!result.success) {
      expect(result.error).toBeInstanceOf(ZodError);
      if (result.error instanceof ZodError) {
        const err = (result.error as ZodError<IGroup>).flatten().fieldErrors;
        console.log(err);
        expect(err.inviteCode?.join("")).toBe(
          "String must contain at least 7 character(s)"
        );
      }
    }
  });
});
