import makeFakeChannel from "../../../../__test__/fixures/channel";
import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import groupTests from "../../../../__test__/functions/group";
import userTests from "../../../../__test__/functions/user";
import makeChannelDb from "./channel-db";

describe("Channel db method tests", () => {
    jest.setTimeout(10000);
    const channelDB = makeChannelDb({ makeDb });

    beforeAll(async () => {
        jest.setTimeout(30000);
        const addedUser = await userTests.addTestUserToDB({ userId: "123" });
        const addedGroup = await groupTests.createTestGroup({
            groupId: "123",
            userId: "123",
        });
    });

    afterAll(async () => {
        await clearDb("group_channels");
        const deletedUser = await userTests.deleteTestUser({ userId: "123" });
        const deletedGroup = await groupTests.deleteTestGroup({
            groupId: "123",
            userId: "123",
        });
    });

    test("SUCCESS: create a channel", async () => {
        const channel = await makeFakeChannel();
        channel.groupId = "123";

        const res = await channelDB.createChannel(channel);
        console.log(res);

        expect(res.data?.channelName).toBe(channel.channelName);
    });

    test("SUCCESS: Delete channel", async () => {
        const channel = await makeFakeChannel();
        channel.groupId = "123";

        const res = await channelDB.createChannel(channel);

        const deletedChannel = await channelDB.deleteChannel(channel.channelId);
        expect(deletedChannel.data?.channelId).toBe(channel.channelId);
    });

    test("SUCCESS: update channel name", async () => {
        const channel = await makeFakeChannel();
        channel.groupId = "123";

        const res = await channelDB.createChannel(channel);

        const updatedChannel = await channelDB.updateChannelName(
            channel.channelId,
            "coders"
        );
        expect(updatedChannel.data?.channelName).toBe("coders");
    });

    test("SUCCESS: get channel by id", async () => {
        const channel = await makeFakeChannel();
        channel.groupId = "123";

        const res = await channelDB.createChannel(channel);

        const foundChannel = await channelDB.getChannelById(channel.channelId);
        expect(foundChannel.data?.channelId).toBe(channel.channelId);
    });

    test("SUCCESS: get channels by group id", async () => {
        let channel = await makeFakeChannel();
        channel.groupId = "123";

        let res = await channelDB.createChannel(channel);

        channel = await makeFakeChannel();
        channel.groupId = "123";
        res = await channelDB.createChannel(channel);

        channel = await makeFakeChannel();
        channel.groupId = "123";
        res = await channelDB.createChannel(channel);

        channel = await makeFakeChannel();
        channel.groupId = "123";
        res = await channelDB.createChannel(channel);

        const foundChannels = await channelDB.getChannelsByGroupId(
            channel.groupId
        );
        console.log(foundChannels);
        if (foundChannels.data)
            expect(
                foundChannels.data[foundChannels.data.length - 1].channelName
            ).toBe(channel.channelName);
    });
});
