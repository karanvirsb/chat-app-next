import { z } from "zod";

import { EntityReturn } from "@/shared/types/returns";

import { IId } from "../../Utilities/id";

export const GroupChannelSchema = z.object({
  channelId: z.string().uuid(),
  channelName: z
    .string()
    .min(3, {
      message: "Channel name should be greater than 3 characters",
    })
    .max(50, {
      message: "Channel name should be less than 50 characters",
    }),
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
  }: IGroupChannel): EntityReturn<
    Readonly<{
      getChannelId: () => string;
      getChannelName: () => string;
      getGroupId: () => string;
      getDateCreated: () => Date;
    }>
  > {
    const sanitizedChannelName = sanitizeText(channelName);

    const result = GroupChannelSchema.safeParse({
      channelId,
      channelName: sanitizedChannelName,
      groupId,
      dateCreated,
    });
    if (!result.success) {
      return result;
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

    return {
      success: true,
      data: Object.freeze({
        getChannelId: () => channelId,
        getChannelName: () => updatedChannelName,
        getGroupId: () => groupId,
        getDateCreated: () => dateCreated,
      }),
    };
  };
}
