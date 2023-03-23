import { faker } from "@faker-js/faker";
import cuid from "cuid";
import { IGroupMessage } from "../../src/Features/groupMessage/groupMessage";

export default async function makeFakeMessage(
    channelId: string,
    userId: string
): Promise<IGroupMessage> {
    return {
        channelId: channelId,
        dateCreated: new Date(),
        messageId: cuid(),
        text: faker.lorem.lines(1),
        userId: userId,
        dateModified: new Date(),
        replyTo: "",
    };
}
