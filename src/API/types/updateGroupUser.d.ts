import { ZodError, z } from "zod";
import { IGroupUsersDb } from "../data-access";
import { DBUpdateStr } from "../../../Utilities/DBUpdateString";
import { httpResponseType } from "../../../express-callback";

import { IGroupUser, IGroupUserSchema } from "../groupUsers";

export type updateGroupUserProps = z.infer<typeof updateGroupUserProps>;

export type makeUpdateGroupUserControllerDeps = {
  updateGroupUserUC: ({
    groupId,
    userId,
    updates,
  }: updateGroupUserProps) => Promise<UseCaseReturn<IGroupUser>>;
};

// export interface IUpdateGroupUserC extends httpResponseType {
//   body: {
//     success: boolean;
//     data: IGroupUser | undefined;
//     error: string;
//   };
// }

export type makeUpdateGroupUserUCDeps = {
  updateGroupUserDBA: ({
    groupId,
    userId,
    updates,
  }: updateGroupUserProps) => Promise<DBAccessReturn<IGroupUser>>;
};

export type makeUpdateGroupUserDBADeps = {
  makeDb: IGroupUsersDb["makeDb"];
  DBUpdateStr: DBUpdateStr;
};
