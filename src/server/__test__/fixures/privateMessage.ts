import { faker } from "@faker-js/faker";
import cuid from "cuid";
import { IPrivateMessage } from "../../src/Features/privateMessage/privateMessage";

export default async function makeFakePrivateMessage(
    privateChannelId: string,
    userId: string
): Promise<IPrivateMessage> {
    return {
        privateChannelId: privateChannelId,
        dateCreated: new Date(),
        messageId: cuid(),
        text: faker.lorem.lines(1),
        userId: userId,
        dateModified: new Date(),
        replyTo: "",
    };
}
