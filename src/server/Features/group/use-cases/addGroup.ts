import { IMakeGroupDb } from "../data-access/group-db";
import { IGroup } from "../group";
import makeGroup from "../index";
import { handleModerationType } from ".";

type props = {
  groupDb: IMakeGroupDb["returnType"];
  handleModeration: handleModerationType;
};

export interface IAddGroup {
  addGroup: (
    groupInfo: IGroup,
    userId: string
  ) => Promise<UseCaseReturn<IGroup>>;
}

export default function makeAddGroup({ groupDb, handleModeration }: props) {
  return async function addGroup(
    groupInfo: IGroup,
    userId: string
  ): Promise<UseCaseReturn<IGroup>> {
    if (!userId) throw new Error("User id needs to be supplied");
    const result = makeGroup(groupInfo);
    if (!result.success) {
      return { success: false, error: result.error };
    }

    const group = result.data;
    const foundGroup = await groupDb.findById(group.getGroupId());

    if (foundGroup.success && foundGroup.data !== undefined) {
      return {
        success: false,
        error: "Group already exists",
      };
    }

    const moderatedName = await handleModeration(group?.getGroupName());

    if (moderatedName) {
      throw Error("Group name contains profanity");
    }

    if (moderatedName === -1) {
      throw Error("Server Error, please try again.");
    }

    return await groupDb.createGroup(
      {
        groupId: group.getGroupId(),
        groupName: group.getGroupName(),
        inviteCode: group.getInviteCode(),
        dateCreated: group.getDateCreated(),
      },
      userId
    );
  };
}
