import {
  IMakeMessageDb,
  returingPaginatedMessages,
} from "../data-access/message-db";

type props = {
  messageDb: IMakeMessageDb["returnType"];
};

export interface IGetMessagesByChannelIdUseCase {
  getMessagesByChannelId: (
    channelId: string,
    dateCreated: Date,
    limit: number
  ) => returingPaginatedMessages;
}

export default function makeGetMessagesByChannelId({ messageDb }: props) {
  return async function getMessagesByChannelId(
    channelId: string,
    dateCreated: Date,
    limit: number = 15
  ): returingPaginatedMessages {
    if (!channelId) throw new Error("Message Id needs to be supplied.");
    if (!dateCreated || Number.isNaN(dateCreated.getTime()))
      throw new Error("Date Created needs to be supplied.");

    return await messageDb.getMessagesByChannelId(
      channelId,
      dateCreated,
      limit
    );
  };
}
