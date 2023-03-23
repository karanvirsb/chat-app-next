import { IMakePrivateMessageDb } from "../data-access/privateMessage-db";
import { IPrivateMessage } from "../privateMessage";

type props = {
    privateMessageDb: IMakePrivateMessageDb["returnType"];
};

type returnData = Promise<{
    success: boolean;
    data: IPrivateMessage | undefined;
    error: string;
}>;

export interface IGetPrivateMessageByIdUseCase {
    getPrivateMessageById: (messageId: string) => returnData;
}

export default function makeGetPrivateMessageById({ privateMessageDb }: props) {
    return async function getPrivateMessageById(messageId: string): returnData {
        if (!messageId) throw new Error("Message Id needs to be supplied.");

        return privateMessageDb.getPrivateMessageById(messageId);
    };
}
