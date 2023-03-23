import makeGroup from "../index";
import { handleModerationType } from ".";
import { IMakeGroupDb } from "../data-access/group-db";
import { IGroup } from "../group";

type props = {
    groupDb: IMakeGroupDb["returnType"];
    handleModeration: handleModerationType;
};

type returnData = Promise<{
    success: boolean;
    data: IGroup | undefined;
    error: string;
}>;

export interface IAddGroup {
    addGroup: (groupInfo: IGroup, userId: string) => Promise<returnData>;
}

export default function makeAddGroup({ groupDb, handleModeration }: props) {
    return async function addGroup(
        groupInfo: IGroup,
        userId: string
    ): Promise<returnData> {
        if (!userId) throw new Error("User id needs to be supplied");
        const group = makeGroup(groupInfo);
        const foundGroup = await groupDb.findById(group.getGroupId());

        if (foundGroup.success && foundGroup.data !== undefined) {
            return {
                success: true,
                data: undefined,
                error: "Group already exists",
            };
        }

        const moderatedName = await handleModeration(group.getGroupName());

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
