import { IId } from "../../Utilities/id";

export interface IPrivateMessage {
    userId: string;
    dateCreated: Date;
    messageId: string;
    dateModified?: Date;
    replyTo?: string;
    text: string;
    privateChannelId: string;
}

type props = {
    Id: IId;
    sanitizeText: (text: string) => string;
};

export default function buildPrivateMessage({ Id, sanitizeText }: props) {
    return function makePrivateMessage({
        messageId = Id.makeId(),
        dateCreated = new Date(),
        dateModified,
        replyTo,
        text,
        userId,
        privateChannelId,
    }: IPrivateMessage) {
        if (!text) throw new Error("Text needs to be supplied.");
        const sanitizedText = sanitizeText(text);

        if (sanitizedText.length < 1)
            throw new Error("Enter valid characters to send a message.");

        if (sanitizedText.length < 1 || sanitizedText.length > 200)
            throw new Error(
                "Messages can only be between 1 and 200 characters long"
            );

        if (!userId) throw new Error("User Id needs to be supplied.");
        if (!dateCreated) throw new Error("Date Created needs to be supplied.");
        if (!messageId) throw new Error("Message Id needs to be supplied.");
        if (!privateChannelId)
            throw new Error("Channel Id needs to be supplied.");

        // replace any ' with a '' to escape
        const newMessage = sanitizedText.replace(/'/g, "\\'");

        return Object.freeze({
            getUserId: () => userId,
            getDateCreated: () => dateCreated,
            getMessageId: () => messageId,
            getDateModified: () => dateModified,
            getReplyTo: () => replyTo,
            getText: () => newMessage,
            getPrivateChannelId: () => privateChannelId,
        });
    };
}
