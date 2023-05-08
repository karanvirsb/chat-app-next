import { IMakeMessageDb } from "../data-access/message-db";
import { IGroupMessage } from "../groupMessage";
import makeMessage from "../index";

type props = {
  messageDb: IMakeMessageDb["returnType"];
};

type returnData = Promise<{
  success: boolean;
  data: IGroupMessage | undefined;
  error: string;
}>;

export interface ICreateMessageUseCase {
  createMessage: (messageInfo: IGroupMessage) => returnData;
}

export default function makeCreateMessage({ messageDb }: props) {
  return async function createMessage(
    messageInfo: IGroupMessage
  ): Promise<UseCaseReturn<IGroupMessage>> {
    const message = makeMessage(messageInfo);

    if (!message.success) return message;

    return await messageDb.createMessage({
      channelId: message.data.getChannelId(),
      dateCreated: message.data.getDateCreated(),
      messageId: message.data.getMessageId(),
      text: message.data.getText(),
      userId: message.data.getUserId(),
      dateModified: message.data.getDateModified(),
      replyTo: message.data.getReplyTo(),
    });
  };
}
