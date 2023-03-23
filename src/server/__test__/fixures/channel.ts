import { faker } from "@faker-js/faker";
import cuid from "cuid";
import { IGroupChannel } from "../../src/Features/groupChannel/groupChannel";

export default async function makeFakeChannel(): Promise<IGroupChannel> {
    return {
        channelId: cuid(),
        channelName: faker.animal.cat().toString(),
        dateCreated: new Date(),
        groupId: cuid(),
    };
}
