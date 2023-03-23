import makeFakePrivateChannel from "../../../../__test__/fixures/privateChannel";
import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makePrivateChannelDb from "./privateChannel-db";
import userTests from "../../../../__test__/functions/user";

describe("Private Channel db method tests", () => {
    jest.setTimeout(10000);
    const privateChannelDB = makePrivateChannelDb({ makeDb });

    beforeAll(async () => {
        jest.setTimeout(30000);
        const addedUser = await userTests.addTestUserToDB({
            userId: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
        });
        const secondUser = await userTests.addTestUserToDB({
            userId: "312c0878-04c3-4585-835e-c66900ccc7a1",
        });
    });

    afterAll(async () => {
        await clearDb("group_messages");
        const deletedUser = await userTests.deleteTestUser({
            userId: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
        });
        const deletedSecondUser = await userTests.deleteTestUser({
            userId: "312c0878-04c3-4585-835e-c66900ccc7a1",
        });
    });

    test("SUCCESS: create a private channel", async () => {
        const channel = await makeFakePrivateChannel(
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
            "312c0878-04c3-4585-835e-c66900ccc7a1"
        );

        const res = await privateChannelDB.createPrivateChannel(channel);
        console.log(res);

        expect(res.data?.channelName).toBe(channel.channelName);
    });

    test("SUCCESS: Delete channel", async () => {
        const channel = await makeFakePrivateChannel(
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
            "312c0878-04c3-4585-835e-c66900ccc7a1"
        );

        const res = await privateChannelDB.createPrivateChannel(channel);

        const deletedChannel = await privateChannelDB.deletePrivateChannel(
            channel.channelId
        );
        expect(deletedChannel.data?.channelId).toBe(channel.channelId);
    });

    test("SUCCESS: get private channel by id", async () => {
        const channel = await makeFakePrivateChannel(
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
            "312c0878-04c3-4585-835e-c66900ccc7a1"
        );

        const res = await privateChannelDB.createPrivateChannel(channel);

        const foundChannel = await privateChannelDB.getPrivateChannelById(
            channel.channelId
        );
        expect(foundChannel.data?.channelId).toBe(channel.channelId);
    });

    test("SUCCESS: get private channels by user id", async () => {
        let channel = await makeFakePrivateChannel(
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
            "312c0878-04c3-4585-835e-c66900ccc7a1"
        );

        let res = await privateChannelDB.createPrivateChannel(channel);

        channel = await makeFakePrivateChannel(
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
            "312c0878-04c3-4585-835e-c66900ccc7a1"
        );

        res = await privateChannelDB.createPrivateChannel(channel);

        channel = await makeFakePrivateChannel(
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
            "312c0878-04c3-4585-835e-c66900ccc7a1"
        );

        res = await privateChannelDB.createPrivateChannel(channel);

        channel = await makeFakePrivateChannel(
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
            "312c0878-04c3-4585-835e-c66900ccc7a1"
        );
        res = await privateChannelDB.createPrivateChannel(channel);

        const foundChannels = await privateChannelDB.getPrivateChannelsByUserId(
            channel.userId
        );
        console.log(foundChannels);
        if (foundChannels.data)
            expect(
                foundChannels.data[foundChannels.data.length - 1].channelName
            ).toBe(channel.channelName);
    });
});
