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

export interface IUpdateMessageTextUseCase {
    updateMessageText: (messageId: string, updateValue: string) => returnData;
}

export default function makeUpdateMessageText({ messageDb }: props) {
    return async function updateMessageText(
        messageId: string,
        updateValue: string
    ): returnData {
        if (!messageId) throw new Error("Message Id needs to be supplied.");
        if (!updateValue) throw new Error("Update Value needs to be supplied.");
        const regex = /'/g;

        // replace any ' with a '' to escape
        const newUpdateValue = updateValue.replace(regex, "\\'");

        return messageDb.updateMessage("text", messageId, newUpdateValue);
    };
}
