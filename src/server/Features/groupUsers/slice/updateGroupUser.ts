import { IHttpRequest } from "../../../express-callback";
import { IGroupUser, IGroupUserSchema } from "../groupUsers";
import { ZodError, z } from "zod";
import type {
  makeUpdateGroupUserControllerDeps,
  updateGroupUserProps,
  makeUpdateGroupUserUCDeps,
  makeUpdateGroupUserDBADeps,
} from "../types/updateGroupUser";

export const updateGroupUserPropsSchema = z.object({
  groupId: IGroupUserSchema.shape.gId,
  userId: IGroupUserSchema.shape.uId,
  updates: IGroupUserSchema.partial().omit({ gId: true, uId: true }),
});

export type updateGroupUser = z.infer<typeof updateGroupUserPropsSchema>;

export function makeUpdateGroupUserController({
  updateGroupUserUC,
}: makeUpdateGroupUserControllerDeps) {
  return async function updateGroupUserController(
    httpRequest: IHttpRequest
  ): Promise<ControllerReturn<IGroupUser>> {
    const headers = {
      "Content-Type": "application/json",
    };
    try {
      const updateParams = {
        groupId: httpRequest.body.groupId,
        userId: httpRequest.body.userId,
        updates: httpRequest.body.updates,
      };
      const result = await updateGroupUserUC(updateParams);
      return { body: result, headers, statusCode: 200 };
    } catch (error) {
      return {
        body: { success: false, error: error },
        headers,
        statusCode: 400,
      };
    }
  };
}

export function makeUpdateGroupUserUC({
  updateGroupUserDBA,
}: makeUpdateGroupUserUCDeps) {
  return async function updateGroupUserUC({
    groupId,
    updates,
    userId,
  }: updateGroupUserProps): Promise<UseCaseReturn<IGroupUser>> {
    try {
      // test with zod
      const result = await updateGroupUserPropsSchema.safeParseAsync({
        groupId,
        updates,
        userId,
      });
      if (!result.success) {
        return {
          success: false,
          error: result.error,
        };
        // throw new ZodError(result.error.issues);
      }
    } catch (error: unknown) {
      return {
        success: false,
        error: error,
      };
    }
    // if zod passes
    return updateGroupUserDBA({ groupId, userId, updates });
  };
}

export function makeUpdateGroupUserDBA({
  makeDb,
  DBUpdateStr,
}: makeUpdateGroupUserDBADeps) {
  return async function updateGroupUserDBA({
    groupId,
    userId,
    updates,
  }: updateGroupUserProps): Promise<DBAccessReturn<IGroupUser>> {
    const db = await makeDb();
    const updateStr = DBUpdateStr(updates);

    const query = `
      UPDATE "groupUsers" 
      SET ${updateStr} 
      WHERE "gId" = '${groupId}' 
        AND "uId" = '${userId}' 
      RETURNING "gId", "uId", "lastChecked"::TIMESTAMP WITH TIME ZONE, roles;
    `;
    try {
      const result = await db.query(query);

      if (result.rowCount >= 1) {
        const groupUser: IGroupUser = result.rows[0];
        return {
          success: true,
          data: groupUser,
        };
      } else {
        return {
          success: true,
          data: undefined,
        };
      }
    } catch (error: unknown) {
      return {
        success: false,
        error: error,
      };
    } finally {
      db.release();
    }
  };
}
