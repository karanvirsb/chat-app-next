import { IMakeChannelDb } from "../data-access/channel-db";
import { IGroupChannel } from "../groupChannel";
import { deleteChannel } from ".";

type props = {
  channelDb: IMakeChannelDb["returnType"];
};

type returnData = Promise<{
  success: boolean;
  data: IGroupChannel | undefined;
  error: string;
}>;

export interface IDeleteChannelUseCase {
  deleteChannel: (channelId: string) => Promise<returnData>;
}

export default function makeDeleteChannel({
  channelDb,
}: props): IDeleteChannelUseCase["deleteChannel"] {
  return async function deleteChannel(channelId: string): Promise<returnData> {
    if (!channelId) throw new Error("Channel Id needs to be supplied");

    return await channelDb.deleteChannel(channelId);
  };
}
