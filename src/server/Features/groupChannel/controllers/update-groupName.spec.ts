import makeChannelDb from "../data-access/channel-db";
import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeCreateChannel from "../use-cases/createChannel";
import { moderateName } from "../../../Utilities/moderateText";
import makeFakeChannel from "../../../../__test__/fixures/channel";
import makeUpdateChannelName from "../use-cases/updateChannelName";
import makeUpdateChannelNameController from "./update-groupName";
import groupTests from "../../../../__test__/functions/group";
import userTests from "../../../../__test__/functions/user";

describe("Update group name controller", () => {
    jest.setTimeout(10000);
    // const channelRequest = {
    //     body: {},
    //     headers: {},
    //     ip: "",
    //     method: "",
    //     params: {},
    //     path: "",
    //     query: {},
    // };
    const handleModeration = async (name: string) => {
        return await moderateName(name);
    };

    const channelDb = makeChannelDb({ makeDb });
    const createChannel = makeCreateChannel({ handleModeration, channelDb });

    const updateChannelName = makeUpdateChannelName({
        handleModeration,
        channelDb,
    });
    const updateChannelNameController = makeUpdateChannelNameController({
        updateChannelName,
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
        const channelRequest = {
            body: { channelId: channel.channelId, newName: "coders" },
            headers: {},
            ip: "",
            method: "POST",
            params: {},
            path: "",
            query: {},
        };

        const createdChannel = await createChannel(channel);

        const updatedChannel = await updateChannelNameController(
            channelRequest
        );

        expect(updatedChannel.body.data?.channelName).toBe("coders");
    });

    test("ERROR: channel id does not exist", async () => {
        const channel = await makeFakeChannel();
        channel.groupId = "123";
        const channelRequest = {
            body: { channelId: "", newName: "coders" },
            headers: {},
            ip: "",
            method: "POST",
            params: {},
            path: "",
            query: {},
        };

        const createdChannel = await createChannel(channel);

        const updatedChannel = await updateChannelNameController(
            channelRequest
        );
        expect(updatedChannel.body.error).toBe(
            "Channel Id needs to be supplied"
        );
    });

    test("ERROR: new name does not exist", async () => {
        const channel = await makeFakeChannel();
        channel.groupId = "123";
        const channelRequest = {
            body: { channelId: channel.channelId, newName: "" },
            headers: {},
            ip: "",
            method: "POST",
            params: {},
            path: "",
            query: {},
        };

        const createdChannel = await createChannel(channel);

        const updatedChannel = await updateChannelNameController(
            channelRequest
        );
        expect(updatedChannel.body.error).toBe(
            "New Channel Name needs to be supplied"
        );
    });

    test("ERROR: new name contains profanity", async () => {
        const channel = await makeFakeChannel();
        channel.groupId = "123";
        const channelRequest = {
            body: { channelId: channel.channelId, newName: "bullshit" },
            headers: {},
            ip: "",
            method: "POST",
            params: {},
            path: "",
            query: {},
        };

        const createdChannel = await createChannel(channel);

        const updatedChannel = await updateChannelNameController(
            channelRequest
        );
        expect(updatedChannel.body.error).toBe(
            "New Channel Name contains profanity"
        );
    });
});
