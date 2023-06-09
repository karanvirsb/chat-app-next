import { IGroupUser } from "../../groupUsers/groupUsers";
import { IMakeGroupDb, user } from "../data-access/group-db";
import { IGroup } from "../group";

type props = {
  groupDb: IMakeGroupDb["returnType"];
};

type returnData = Promise<{
  success: boolean;
  data: user | undefined;
  error: string;
}>;

export interface IAddUserToGroup {
  addUserToGroup: (
    groupId: string,
    userId: string
  ) => Promise<UseCaseReturn<IGroup>>;
}

export default function makeAddUserToGroup({ groupDb }: props) {
  return async function addUserToGroup(
    groupId: string,
    userId: string
  ): Promise<UseCaseReturn<IGroupUser>> {
    if (!groupId) throw new Error("Group Id needs to be supplied");
    if (!userId) throw new Error("User Id needs to be supplied");

    return await groupDb.addUserToGroup(groupId, userId, ["2002"]);
  };
}
