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
    ): returnData {
        const message = makeMessage(messageInfo);

        return messageDb.createMessage({
            channelId: message.getChannelId(),
            dateCreated: message.getDateCreated(),
            messageId: message.getMessageId(),
            text: message.getText(),
            userId: message.getUserId(),
        });
    };
}
