import { z } from "zod";

import { EntityReturn } from "@/shared/types/returns";

import { IId } from "../../Utilities/id";

const PrivateChannelSchema = z.object({
  channelId: z.string().uuid(),
  channelName: z
    .string()
    .min(3, "Channel name has to be atleast 3 characters.")
    .max(50, "Channel name cannot be more than 50 characters"),
  dateCreated: z.date(),
  userId: z.string().uuid(),
  friendsId: z.string().uuid(),
  lastActive: z.date(),
  // lastRead: z.date()
});

type IPrivateChannel = z.infer<typeof PrivateChannelSchema>;

type props = {
  Id: IId;
  sanitizeText: (text: string) => string;
};

export default function buildPrivateChannel({ Id, sanitizeText }: props) {
  return function makePrivateChannel({
    channelId = Id.makeId(),
    channelName,
    userId,
    friendsId,
    dateCreated = new Date(),
    lastActive = new Date(),
  }: IPrivateChannel): EntityReturn<IPrivateChannel> {
    const sanitizedChannelName = sanitizeText(channelName);

    if (sanitizedChannelName.length <= 1) {
      throw new Error("Channel name should contain valid characters");
    }

    if (sanitizedChannelName.length < 3 || sanitizedChannelName.length > 50) {
      throw new Error("Channel name should be between 3 to 50 characters long");
    }

    if (!userId) {
      throw new Error("User Id needs to be supplied");
    }

    if (!friendsId) throw new Error("Friends Id needs to be supplied");

    if (!dateCreated) {
      throw new Error("Date needs to be supplied");
    }

    if (!channelId) {
      throw new Error("Channel Id needs to be supplied");
    }

    if (!lastActive || Number.isNaN(lastActive.getTime())) {
      throw new Error("Last active needs to be supplied");
    }

    // replace any ' with a '' to escape
    const newChannelName = sanitizedChannelName.replace(/'/g, "''");
    return {
      success: true,
      data: Object.freeze({
        getChannelId: () => channelId,
        getChannelName: () => newChannelName,
        getUserId: () => userId,
        getFriendsId: () => friendsId,
        getDateCreated: () => dateCreated,
        getLastActive: () => lastActive,
      }),
    };
  };
}
