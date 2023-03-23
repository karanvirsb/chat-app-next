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

export interface IUpdateDateModifiedUseCase {
    updateDateModified: (messageId: string, updateValue: Date) => returnData;
}

export default function makeUpdateDateModified({ privateMessageDb }: props) {
    return async function updateDateModified(
        messageId: string,
        updateValue: Date
    ): returnData {
        if (!messageId) throw new Error("Message Id needs to be supplied.");
        if (!updateValue || Number.isNaN(updateValue.getTime()))
            throw new Error("Update Value needs to be a Date.");

        // need to convert date
        const newUpdateValue = `to_timestamp(${updateValue.getTime() / 1000})`;

        return privateMessageDb.updatePrivateMessage(
            "dateCreated",
            messageId,
            newUpdateValue
        );
    };
}
