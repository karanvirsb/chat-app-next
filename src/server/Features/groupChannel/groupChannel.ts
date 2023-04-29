import { z, ZodError } from "zod";

import { IId } from "../../Utilities/id";

export const GroupChannelSchema = z.object({
  channelId: z.string().uuid(),
  channelName: z.string().refine(
    (val) => {
      if (val.length < 3 || val.length > 50) {
        return false;
      }
    },
    { message: "Channel name should be between 3 to 50 characters long" }
  ),
  dateCreated: z.date(),
  groupId: z.string(),
});

export type IGroupChannel = z.infer<typeof GroupChannelSchema>;

type props = {
  Id: IId;
  sanitizeText: (text: string) => string;
};

export default function buildChannel({ Id, sanitizeText }: props) {
  return function makeChannel({
    channelId = Id.makeId(),
    channelName,
    groupId,
    dateCreated = new Date(),
  }: IGroupChannel) {
    const sanitizedChannelName = sanitizeText(channelName);

    const result = GroupChannelSchema.safeParse({
      channelId,
      sanitizedChannelName,
      groupId,
      dateCreated,
    });
    if (!result.success) {
      throw new ZodError(result.error.issues);
    }
    // if (sanitizedChannelName.length <= 1) {
    //   throw new Error("Channel name should contain valid characters");
    // }

    // if (sanitizedChannelName.length < 3 || sanitizedChannelName.length > 50) {
    //   throw new Error("Channel name should be between 3 to 50 characters long");
    // }

    // if (!groupId) {
    //   throw new Error("Group Id needs to be supplied");
    // }

    // if (!dateCreated) {
    //   throw new Error("Date needs to be supplied");
    // }

    // if (!channelId) {
    //   throw new Error("Channel Id needs to be supplied");
    // }

    // replace any ' with a '' to escape
    const updatedChannelName = sanitizedChannelName.replace(/'/g, "''");

    return Object.freeze({
      getChannelId: () => channelId,
      getChannelName: () => updatedChannelName,
      getGroupId: () => groupId,
      getDateCreated: () => dateCreated,
    });
  };
}
