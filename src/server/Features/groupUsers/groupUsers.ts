import { ZodError, z } from "zod";
export const IGroupUserSchema = z.object({
  gId: z.string().min(21),
  lastChecked: z.date(),
  roles: z.array(z.string()).min(1),
  uId: z.string().min(21),
});

export type IGroupUser = z.infer<typeof IGroupUserSchema>;

export default function makeGroupUser() {
  return function createGroupUser({
    gId,
    uId,
    roles,
    lastChecked,
  }: IGroupUser) {
    // if (gId === null || gId.length <= 0)
    //   throw new Error("Group Id must be string.");
    // if (uId === null || uId.length <= 0) throw new Error("uId must be string.");
    // if (roles === null || roles.length <= 0)
    //   throw new Error("Roles must be an array.");
    // if (lastChecked === null || Number.isNaN(lastChecked.getTime()))
    //   throw new Error("LastChecked must be a real date.");

    const result = IGroupUserSchema.safeParse({ gId, uId, roles, lastChecked });
    if (!result.success) {
      throw new ZodError<IGroupUser>(result.error.errors);
    }

    return Object.freeze({
      getgId: () => gId,
      getuId: () => uId,
      getRoles: () => roles,
      getLastChecked: () => lastChecked,
    });
  };
}
