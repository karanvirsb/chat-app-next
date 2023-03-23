import { faker } from "@faker-js/faker";
import cuid from "cuid";
import { IPrivateChannel } from "../../src/Features/privateChannel/privateChannel";

export default async function makeFakePrivateChannel(
    userId: string,
    friendsId: string
): Promise<IPrivateChannel> {
    return {
        channelId: cuid(),
        channelName: faker.animal.cat().toString(),
        dateCreated: new Date(),
        userId,
        friendsId,
        lastActive: new Date(),
    };
}
