import { IMakePrivateMessageDb } from "../data-access/privateMessage-db";
import { IPrivateMessage } from "../privateMessage";
import makePrivateMessage from "../index";

type props = {
    privateMessageDb: IMakePrivateMessageDb["returnType"];
};

type returnData = Promise<{
    success: boolean;
    data: IPrivateMessage | undefined;
    error: string;
}>;

export interface ICreatePrivateMessageUseCase {
    createPrivateMessage: (messageInfo: IPrivateMessage) => returnData;
}

export default function makeCreatePrivateMessage({ privateMessageDb }: props) {
    return async function createPrivateMessage(
        messageInfo: IPrivateMessage
    ): returnData {
        const message = makePrivateMessage(messageInfo);

        return privateMessageDb.createPrivateMessage({
            privateChannelId: message.getPrivateChannelId(),
            dateCreated: message.getDateCreated(),
            messageId: message.getMessageId(),
            text: message.getText(),
            userId: message.getUserId(),
        });
    };
}
