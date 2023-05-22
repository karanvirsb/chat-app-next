import { IMakeMessageDb } from "../data-access/message-db";
import { IGroupMessage } from "../groupMessage";
import makeMessage from "../index";

type props = {
  messageDb: IMakeMessageDb["returnType"];
};

export interface ICreateMessageUseCase {
  createMessage: (
    messageInfo: IGroupMessage
  ) => Promise<UseCaseReturn<IGroupMessage>>;
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
      dateModified: message?.data?.getDateModified() ?? undefined,
      replyTo: message?.data?.getReplyTo() ?? undefined,
    });
  };
}
