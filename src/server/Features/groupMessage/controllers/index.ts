import messageService from "../use-cases";
import makeCreateMessageController from "./create-message";
import makeDeleteMessageController from "./delete-message";
import makeGetMessageByIdController from "./get-messageById";
import makeGetMessagesByChannelIdController from "./get-messagesByChannelId";
import makeUpdateDateModifiedController from "./update-dateModified";
import makeUpdateMessageTextController from "./update-messageText";

const createMessageController = makeCreateMessageController({
    createMessage: messageService.createMessage,
});
const deleteMessageController = makeDeleteMessageController({
    deleteMessage: messageService.deleteMessage,
});
const getMessageByIdController = makeGetMessageByIdController({
    getMessageById: messageService.getMessageById,
});

const getMessagesByChannelIdController = makeGetMessagesByChannelIdController({
    getMessagesByChannelId: messageService.getMessagesByChannelId,
});

const updateDateModifiedController = makeUpdateDateModifiedController({
    updateDateModified: messageService.updateDateModified,
});

const updateMessageTextController = makeUpdateMessageTextController({
    updateMessageText: messageService.updateMessageText,
});

const messagesController = Object.freeze({
    createMessageController,
    deleteMessageController,
    getMessageByIdController,
    getMessagesByChannelIdController,
    updateDateModifiedController,
    updateMessageTextController,
});

export default messagesController;

export {
    createMessageController,
    deleteMessageController,
    getMessageByIdController,
    getMessagesByChannelIdController,
    updateDateModifiedController,
    updateMessageTextController,
};
