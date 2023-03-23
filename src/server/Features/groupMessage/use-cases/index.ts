import makeCreateMessage from "./createMessage";
import messageDb from "../data-access";
import makeDeleteMessage from "./deleteMessage";
import makeGetMessageById from "./getMessageById";
import makeGetMessagesByChannelId from "./getMessagesByChannelId";
import makeUpdateMessageText from "./updateMessageText";
import makeUpdateDateModified from "./updateDateModified";

const createMessage = makeCreateMessage({ messageDb });
const deleteMessage = makeDeleteMessage({ messageDb });
const getMessageById = makeGetMessageById({ messageDb });
const getMessagesByChannelId = makeGetMessagesByChannelId({ messageDb });
const updateMessageText = makeUpdateMessageText({ messageDb });
const updateDateModified = makeUpdateDateModified({ messageDb });

const messageService = Object.freeze({
    createMessage,
    deleteMessage,
    getMessageById,
    getMessagesByChannelId,
    updateMessageText,
    updateDateModified,
});

export default messageService;

export {
    createMessage,
    deleteMessage,
    getMessageById,
    getMessagesByChannelId,
    updateMessageText,
    updateDateModified,
};
