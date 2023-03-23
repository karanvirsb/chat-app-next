import privateMessageService from "../use-cases";
import makeCreatePrivateMessageController from "./create-privateMessage";
import makeDeletePrivateMessageController from "./delete-privateMessage";
import makeGetPrivateMessageByIdController from "./get-privateMessageById";
import makeGetPrivateMessagesByChannelIdController from "./get-privateMessagesByChannelId";
import makeUpdateDateModifiedController from "./update-dateModified";
import makeUpdatePrivateMessageTextController from "./update-privateMessageText";

const createPrivateMessageController = makeCreatePrivateMessageController({
    createPrivateMessage: privateMessageService.createPrivateMessage,
});
const deletePrivateMessageController = makeDeletePrivateMessageController({
    deletePrivateMessage: privateMessageService.deletePrivateMessage,
});
const getPrivateMessageByIdController = makeGetPrivateMessageByIdController({
    getPrivateMessageById: privateMessageService.getPrivateMessageById,
});

const getPrivateMessagesByChannelIdController =
    makeGetPrivateMessagesByChannelIdController({
        getPrivateMessagesByChannelId:
            privateMessageService.getPrivateMessagesByChannelId,
    });

const updateDateModifiedController = makeUpdateDateModifiedController({
    updateDateModified: privateMessageService.updateDateModified,
});

const updatePrivateMessageTextController =
    makeUpdatePrivateMessageTextController({
        updatePrivateMessageText:
            privateMessageService.updatePrivateMessageText,
    });

const privateMessagesController = Object.freeze({
    createPrivateMessageController,
    deletePrivateMessageController,
    getPrivateMessageByIdController,
    getPrivateMessagesByChannelIdController,
    updateDateModifiedController,
    updatePrivateMessageTextController,
});

export default privateMessagesController;

export {
    createPrivateMessageController,
    deletePrivateMessageController,
    getPrivateMessageByIdController,
    getPrivateMessagesByChannelIdController,
    updateDateModifiedController,
    updatePrivateMessageTextController,
};
