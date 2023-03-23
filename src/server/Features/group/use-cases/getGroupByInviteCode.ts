import { IMakeGroupDb } from "../data-access/group-db";
import { IGroup } from "../group";

type props = {
    groupDb: IMakeGroupDb["returnType"];
};

type returnData = Promise<{
    success: boolean;
    data: IGroup | undefined;
    error: string;
}>;

export interface IGetGroupByInviteCode {
    getGroupByInviteCode: (inviteCode: string) => Promise<returnData>;
}

export default function makeGetGroupByInviteCode({ groupDb }: props) {
    return async function getGroupByInviteCode(
        inviteCode: string
    ): Promise<returnData> {
        if (!inviteCode) throw new Error("Invite code needs to be supplied");

        return await groupDb.findByInviteCode(inviteCode);
    };
}
