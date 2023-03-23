import buildGroup from ".";
import { IGroup } from "./group";

describe("Group creation test", () => {
    const group: IGroup = {
        groupId: "1234",
        groupName: "Coders",
        inviteCode: "abcdefg",
        dateCreated: new Date(),
    };

    test("Group name contains html", () => {
        expect(() =>
            buildGroup({ ...group, groupName: "<html></html>" })
        ).toThrow("Group name must contain valid characters");
    });

    test("Group Name must be a certain length", () => {
        expect(() => buildGroup({ ...group, groupName: "bo" })).toThrow(
            "Group name must be between 3 and 50 characters long"
        );
    });

    test("Group id is required", () => {
        expect(() => buildGroup({ ...group, groupId: "" })).toThrow(
            "Group requires an Id"
        );
    });

    test("Group requires an invite code", () => {
        expect(() => buildGroup({ ...group, inviteCode: "" })).toThrow(
            "Group requires an invite code"
        );
    });
});
