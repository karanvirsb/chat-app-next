import buildGroupUser from "..";
import { IGroupUser } from "../groupUsers";
import {
  createGroupUserUCDeps,
  makeCreateGroupDBAccessProps,
} from "../types/createGroupUser";

export function makeCreateGroupUseCase({
  createGroupDb,
}: createGroupUserUCDeps) {
  return async function createGroupUseCase(groupUserInfo: IGroupUser) {
    const groupUser = buildGroupUser(groupUserInfo);

    return await createGroupDb({
      gId: groupUser.getgId(),
      uId: groupUser.getuId(),
      lastChecked: groupUser.getLastChecked(),
      roles: groupUser.getRoles(),
    });
  };
}

export function makeCreateGroupDBAccess({
  makeDb,
}: makeCreateGroupDBAccessProps) {
  return async function createGroupDb({
    gId,
    uId,
    lastChecked,
    roles,
  }: IGroupUser) {
    const db = await makeDb(); // creating db access
    try {
      const q = `INSERT INTO "groupUsers" values('${gId}', '${uId}', '{${roles.join(
        ", "
      )}}', to_timestamp(${lastChecked.getTime()}/1000)) RETURNING *;`;

      const result = await db.query(q);

      if (result.rows.length >= 1) {
        const groupUser: IGroupUser = result.rows[0];
        return { success: true, data: groupUser, error: "" };
      } else {
        return {
          success: true,
          data: undefined,
          error: "Could not insert group user",
        };
      }
    } catch (error) {
      console.log("🚀 ~ file: createGroupUser.ts:35 ~ error", error);

      return {
        success: false,
        data: undefined,
        error: error + "",
      };
    } finally {
      db.release();
    }
  };
}
