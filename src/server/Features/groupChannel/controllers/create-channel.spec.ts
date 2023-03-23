import makeChannelDb from "../data-access/channel-db";
import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeCreateChannel from "../use-cases/createChannel";
import { moderateName } from "../../../Utilities/moderateText";
import makeCreateChannelController from "./create-channel";
import makeFakeChannel from "../../../../__test__/fixures/channel";
import groupTests from "../../../../__test__/functions/group";
import userTests from "../../../../__test__/functions/user";

describe("Create channel controller", () => {
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
    const createChannelController = makeCreateChannelController({
        createChannel,
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

    test("SUCCESS: create channel", async () => {
        const channel = await makeFakeChannel();
        channel.groupId = "123";
        const channelRequest = {
            body: { channelInfo: channel },
            headers: {},
            ip: "",
            method: "POST",
            params: {},
            path: "",
            query: {},
        };

        const createdChannel = await createChannelController(channelRequest);
        expect(createdChannel.body.data?.channelName).toBe(channel.channelName);
    });

    test("Error: channel name not supplied", async () => {
        const channel = await makeFakeChannel();
        channel.groupId = "123";

        const channelRequest = {
            body: { channelInfo: { ...channel, channelName: "" } },
            headers: {},
            ip: "",
            method: "POST",
            params: {},
            path: "",
            query: {},
        };

        const createdChannel = await createChannelController(channelRequest);
        expect(createdChannel.body.error).toBe(
            "Channel name needs to be supplied"
        );
    });

    test("Error: group id was not provided", async () => {
        const channel = await makeFakeChannel();
        channel.groupId = "123";
        const channelRequest = {
            body: { channelInfo: { ...channel, groupId: "" } },
            headers: {},
            ip: "",
            method: "POST",
            params: {},
            path: "",
            query: {},
        };

        const createdChannel = await createChannelController(channelRequest);
        expect(createdChannel.body.error).toBe("Group Id needs to be supplied");
    });

    test("Error: channel name contains profanity", async () => {
        const channel = await makeFakeChannel();
        channel.groupId = "123";
        channel.channelName = "bullshit";
        const channelRequest = {
            body: { channelInfo: channel },
            headers: {},
            ip: "",
            method: "POST",
            params: {},
            path: "",
            query: {},
        };

        const createdChannel = await createChannelController(channelRequest);
        expect(createdChannel.body.error).toBe(
            "Channel name contains profanity"
        );
    });
});
