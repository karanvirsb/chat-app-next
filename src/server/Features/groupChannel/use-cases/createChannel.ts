import { IMakeChannelDb } from "../data-access/channel-db";
import { IGroupChannel } from "../groupChannel";
import makeChannel from "../index";

export type handleModerationType = {
  (name: string): Promise<number | boolean>;
};

type props = {
  channelDb: IMakeChannelDb["returnType"];
  handleModeration: handleModerationType;
};

export interface ICreateChannelUseCase {
  createChannel: (
    channelInfo: IGroupChannel
  ) => Promise<UseCaseReturn<IGroupChannel>>;
}

export default function makeCreateChannel({
  handleModeration,
  channelDb,
}: props): ICreateChannelUseCase["createChannel"] {
  return async function createChannel(channelInfo: IGroupChannel) {
    // if (!channelInfo.channelName)
    //   throw new Error("Channel name needs to be supplied");
    // if (!channelInfo.groupId) throw new Error("Group Id needs to be supplied");

    const result = makeChannel(channelInfo);

    if (!result.success) {
      return { success: false, error: result.error };
    }
    const channel = result.data;
    const moderatedName = await handleModeration(channel.getChannelName());

    if (moderatedName) {
      throw new Error("Channel name contains profanity");
    }

    if (moderatedName === -1) {
      throw new Error("Server Error, please try again.");
    }

    const channelExists = await channelDb.getChannelById(
      channel.getChannelId()
    );

    if (channelExists.success && channelExists.data !== undefined) {
      throw new Error("Channel already exists, try again.");
    }

    return await channelDb.createChannel({
      channelId: channel.getChannelId(),
      channelName: channel.getChannelName(),
      dateCreated: channel.getDateCreated(),
      groupId: channel.getGroupId(),
    });
  };
}
