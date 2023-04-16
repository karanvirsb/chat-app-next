import { IGroupUsersDb } from "../data-access";
import { IGroupUser } from "../groupUsers";

export type GetGroupIdsDBA = {
  getGroupIdsDBA: ({
    userId,
  }: {
    userId: string;
  }) => Promise<DBAccessReturn<Pick<IGroupUser, "gId">[]>>;
};

export function makeGetGroupIdsUC({ getGroupIdsDBA }: GetGroupIdsDBA) {
  return async function getGroupIdsUC({
    userId,
  }: {
    userId: string;
  }): Promise<UseCaseReturn<Pick<IGroupUser, "gId">[]>> {
    if (userId.length < 21) {
      return { success: false, error: "Invalid user id" };
    }

    return getGroupIdsDBA({ userId });
  };
}

export type makeGetGroupDBAccessProps = {
  makeDb: IGroupUsersDb["makeDb"];
};

export function makeGetGroupIdsDBA({ makeDb }: makeGetGroupDBAccessProps) {
  return async function getGroupIdsDBA({
    userId,
  }: {
    userId: string;
  }): Promise<DBAccessReturn<Pick<IGroupUser, "gId">[]>> {
    const db = await makeDb();
    try {
      const query = `
      SELECT "gId" as "groupId" 
      FROM "groupUsers" 
      WHERE "uId"='${userId}';`;

      const res = await db.query(query);
      if (res.rowCount >= 1) {
        const groupIds: Pick<IGroupUser, "gId">[] = res.rows;
        return { success: true, data: groupIds };
      }

      return { success: true, data: [] };
    } catch (error) {
      return { success: false, error };
    } finally {
      db.release();
    }
  };
}
