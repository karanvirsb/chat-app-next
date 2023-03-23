import { inviteCodeGeneratorType } from ".";
import { IMakeGroupDb } from "../data-access/group-db";
import { IGroup } from "../group";

type props = {
    groupDb: IMakeGroupDb["returnType"];
    inviteCodeGenerator: inviteCodeGeneratorType;
};

type returnData = Promise<{
    success: boolean;
    data: IGroup | undefined;
    error: string;
}>;

export interface IUpdateInviteCode {
    updateInviteCode: (groupId: string) => Promise<returnData>;
}

export default function makeUpdateInviteCode({
    groupDb,
    inviteCodeGenerator,
}: props) {
    return async function updateInviteCode(
        groupId: string
    ): Promise<returnData> {
        if (!groupId) throw new Error("Group Id needs to be supplied");

        let newInviteCode = inviteCodeGenerator.makeInviteCode();
        let foundGroup = await groupDb.findByInviteCode(newInviteCode);
        while (foundGroup.data !== undefined) {
            newInviteCode = inviteCodeGenerator.makeInviteCode();
            foundGroup = await groupDb.findByInviteCode(newInviteCode);
        }

        return await groupDb.updateInviteCode(groupId, newInviteCode);
    };
}
