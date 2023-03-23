import privateMessageDb from "../data-access";
import makeCreatePrivateMessage from "./createPrivateMessage";
import makeDeletePrivateMessage from "./deletePrivateMessage";
import makeGetPrivateMessageById from "./getPrivateMessageById";
import makeGetPrivateMessagesByChannelId from "./getPrivateMessagesByChannelId";
import makeUpdateDateModified from "./updateDateModified";
import makeUpdatePrivateMessageText from "./updatePrivateMessageText";

const createPrivateMessage = makeCreatePrivateMessage({ privateMessageDb });
const deletePrivateMessage = makeDeletePrivateMessage({ privateMessageDb });
const getPrivateMessageById = makeGetPrivateMessageById({ privateMessageDb });
const getPrivateMessagesByChannelId = makeGetPrivateMessagesByChannelId({
    privateMessageDb,
});
const updatePrivateMessageText = makeUpdatePrivateMessageText({
    privateMessageDb,
});
const updateDateModified = makeUpdateDateModified({ privateMessageDb });

const privateMessageService = Object.freeze({
    createPrivateMessage,
    deletePrivateMessage,
    getPrivateMessageById,
    getPrivateMessagesByChannelId,
    updatePrivateMessageText,
    updateDateModified,
});

export default privateMessageService;

export {
    createPrivateMessage,
    deletePrivateMessage,
    getPrivateMessageById,
    getPrivateMessagesByChannelId,
    updatePrivateMessageText,
    updateDateModified,
};
