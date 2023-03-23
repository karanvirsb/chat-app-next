import makeChannelDb from "../data-access/channel-db";
import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeCreateChannel, { handleModerationType } from "./createChannel";
import { moderateName } from "../../../Utilities/moderateText";
import makeFakeChannel from "../../../../__test__/fixures/channel";
import makeUpdateChannelName from "./updateChannelName";
import groupTests from "../../../../__test__/functions/group";
import userTests from "../../../../__test__/functions/user";

describe("updating channel name use case", () => {
    const handleModeration: handleModerationType = async (
        channelName: string
    ) => {
        return await moderateName(channelName);
    };
    const channelDb = makeChannelDb({ makeDb });
    const createChannel = makeCreateChannel({
        handleModeration,
        channelDb,
    });
    const updateChannelName = makeUpdateChannelName({
        handleModeration,
        channelDb,
    });

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

    test("SUCCESS: updating channel name", async () => {
        const channel = await makeFakeChannel();
        channel.groupId = "123";
        const createdChannel = await createChannel(channel);

        const updatedChannel = await updateChannelName(
            channel.channelId,
            "coders"
        );

        expect(updatedChannel.data?.channelName).toBe("coders");
    });

    test("ERROR: channelId does not exist", async () => {
        const channel = await makeFakeChannel();
        channel.groupId = "123";
        const createdChannel = await createChannel(channel);

        try {
            const updatedChannel = await updateChannelName("", "coders");
        } catch (error) {
            if (error instanceof Error) {
                expect(error.message).toBe("Channel Id needs to be supplied");
            }
        }
    });

    test("ERROR: new name does not exist", async () => {
        const channel = await makeFakeChannel();
        channel.groupId = "123";
        const createdChannel = await createChannel(channel);

        try {
            const updatedChannel = await updateChannelName("123", "");
        } catch (error) {
            if (error instanceof Error) {
                expect(error.message).toBe(
                    "New Channel Name needs to be supplied"
                );
            }
        }
    });

    test("ERROR: new name contains profanity", async () => {
        const channel = await makeFakeChannel();
        channel.groupId = "123";
        const createdChannel = await createChannel(channel);

        try {
            const updatedChannel = await updateChannelName("123", "bullshit");
        } catch (error) {
            if (error instanceof Error) {
                expect(error.message).toBe(
                    "New Channel Name contains profanity"
                );
            }
        }
    });
});
