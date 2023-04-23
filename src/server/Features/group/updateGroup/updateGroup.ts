import { z } from "zod";

import DBUpdateStr from "@/server/Utilities/DBUpdateString";

import { IGroupDb } from "../data-access";
import { GroupSchema, IGroup } from "../group";

const UpdateGroupSchema = z.object({
  groupId: GroupSchema.shape.groupId,
  updates: GroupSchema.omit({ groupId: true, dateCreated: true }).partial(),
});

type UpdateGroup = z.infer<typeof UpdateGroupSchema>;

export function makeUpdateGroupUC({
  updateGroupDBA,
}: {
  updateGroupDBA: ({
    groupId,
    updates,
  }: UpdateGroup) => Promise<DBAccessReturn<IGroup>>;
}) {
  return async function updateGroupUC({
    groupId,
    updates,
  }: UpdateGroup): Promise<UseCaseReturn<IGroup>> {
    const result = UpdateGroupSchema.safeParse({ groupId, updates });

    if (!result.success) {
      return { success: false, error: result.error };
    }

    return await updateGroupDBA({ groupId, updates });
  };
}

export function makeUpdateGroupDBA({ makeDb }: { makeDb: IGroupDb["makeDb"] }) {
  return async function updateGroupDBA({
    groupId,
    updates,
  }: UpdateGroup): Promise<DBAccessReturn<IGroup>> {
    const db = await makeDb();
    const updateStr = DBUpdateStr(updates);
    const query = `UPDATE groupt 
      SET ${updateStr}
      WHERE "groupId" = '${groupId}'
      RETURNING "groupId", "dateCreated"::TIMESTAMP WITH TIME ZONE, "groupName", "inviteCode";
    `;
    try {
      const res = await db.query(query);
      if (res.rowCount >= 1) {
        return { success: true, data: res.rows[0] };
      }
      return { success: false, error: "Could not update group." };
    } catch (error) {
      return { success: false, error: error };
    }
  };
}
