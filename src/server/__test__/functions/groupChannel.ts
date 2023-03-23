import { faker } from "@faker-js/faker";
import makeChannelDb from "../../src/Features/groupChannel/data-access/channel-db";
import makeDb from "../fixures/db";

const channelTests = Object.freeze({ createTestChannel, deleteTestChannel });

export default channelTests;

async function createTestChannel({
    groupId,
    channelId,
}: {
    groupId: string;
    channelId: string;
}) {
    let channelDb = makeChannelDb({ makeDb });

    const channel = {
        channelId,
        channelName: faker.animal.cat(),
        dateCreated: new Date(),
        groupId,
    };

    const createdChannel = await channelDb.createChannel(channel);

    return createdChannel.success && createdChannel.data !== undefined;
}

async function deleteTestChannel({ channelId }: { channelId: string }) {
    let channelDb = makeChannelDb({ makeDb });
    const deletedChannel = await channelDb.deleteChannel(channelId);
    return deletedChannel.success && deletedChannel.data !== undefined;
}
