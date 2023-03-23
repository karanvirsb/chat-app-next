import { IId } from "../../Utilities/id";
import { IInviteCodeGenerator } from "../../Utilities/inviteCodeGenerator";

type props = {
  Id: IId;
  sanitizeText: (text: string) => string;
  inviteCodeGenerator: IInviteCodeGenerator;
};

export interface IGroup {
  groupName: string;
  groupId: string;
  inviteCode: string;
  dateCreated: Date;
  // lastActive: Date
}

export default function buildGroup({
  Id,
  sanitizeText,
  inviteCodeGenerator,
}: props) {
  return function makeGroup({
    groupName,
    groupId = Id.makeId(),
    inviteCode = inviteCodeGenerator.makeInviteCode(),
    dateCreated = new Date(),
  }: IGroup) {
    const regex = /'/g;
    let sanitizedGroupName = sanitizeText(groupName);

    if (sanitizedGroupName.length < 1) {
      throw new Error("Group name must contain valid characters");
    }

    if (sanitizedGroupName.length < 3 || sanitizedGroupName.length > 50) {
      throw new Error("Group name must be between 3 and 50 characters long");
    }

    if (!groupId) {
      throw new Error("Group requires an Id");
    }

    if (!inviteCode) {
      throw new Error("Group requires an invite code");
    }

    if (!dateCreated || Number.isNaN(dateCreated.getTime()))
      throw new Error("Date Created needs to be supplied.");

    // replace any ' with a '' to escape
    const newGroupName = sanitizedGroupName.replace(regex, "''");

    return Object.freeze({
      getGroupName: () => newGroupName,
      getGroupId: () => groupId,
      getInviteCode: () => inviteCode,
      getDateCreated: () => dateCreated,
    });
  };
}
