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
  });

  test("Group Name must be a certain length", () => {
    const result = buildGroup({ ...group, groupName: "bo" });
    expect(result.success).toBeFalsy();
  });

  test("Group id is required", () => {
    const result = buildGroup({ ...group, groupId: "" });
    expect(result.success).toBeFalsy();
  });

  test("Group requires an invite code", () => {
    const result = buildGroup({ ...group, inviteCode: "" });
    expect(result.success).toBeFalsy();
  });
});
