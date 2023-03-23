import { IMakeMessageDb } from "../data-access/message-db";
import { IGroupMessage } from "../groupMessage";

type props = {
    messageDb: IMakeMessageDb["returnType"];
};

type returnData = Promise<{
    success: boolean;
    data: IGroupMessage | undefined;
    error: string;
}>;

export interface IGetMessageByIdUseCase {
    getMessageById: (messageId: string) => returnData;
}

export default function makeGetMessageById({ messageDb }: props) {
    return async function getMessageById(messageId: string): returnData {
        if (!messageId) throw new Error("Message Id needs to be supplied.");

        return messageDb.getMessageById(messageId);
    };
}
