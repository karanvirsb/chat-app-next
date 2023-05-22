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

export interface IUpdateDateModifiedUseCase {
  updateDateModified: (
    messageId: string,
    updateValue: IGroupMessage["dateModified"]
  ) => returnData;
}

export default function makeUpdateDateModified({ messageDb }: props) {
  return async function updateDateModified(
    messageId: string,
    updateValue: IGroupMessage["dateModified"]
  ): returnData {
    if (!messageId) throw new Error("Message Id needs to be supplied.");
    if (!updateValue || Number.isNaN(updateValue))
      throw new Error("Update Value needs to be a Date.");

    return messageDb.updateMessage("dateCreated", messageId, updateValue);
  };
}
