import { IMakePrivateMessageDb } from "../data-access/privateMessage-db";
import makePrivateMessage from "../index";
import { IPrivateMessage } from "../privateMessage";

type props = {
  privateMessageDb: IMakePrivateMessageDb["returnType"];
};

export interface ICreatePrivateMessageUseCase {
  createPrivateMessage: (
    messageInfo: IPrivateMessage
  ) => Promise<UseCaseReturn<IPrivateMessage>>;
}

export default function makeCreatePrivateMessage({ privateMessageDb }: props) {
  return async function createPrivateMessage(
    messageInfo: IPrivateMessage
  ): Promise<UseCaseReturn<IPrivateMessage>> {
    const message = makePrivateMessage(messageInfo);
    if (!message.success) return message;

    return privateMessageDb.createPrivateMessage({
      privateChannelId: message.data.getPrivateChannelId(),
      dateCreated: message.data.getDateCreated(),
      messageId: message.data.getMessageId(),
      text: message.data.getText(),
      userId: message.data.getUserId(),
    });
  };
}
