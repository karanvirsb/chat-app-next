import makeChannelDb from "../data-access/channel-db";
import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeCreateChannel from "../use-cases/createChannel";
import { moderateName } from "../../../Utilities/moderateText";
import makeFakeChannel from "../../../../__test__/fixures/channel";
import makeGetChannelById from "../use-cases/getChannelById";
import makeGetChannelByIdController from "./get-channelbyId";
import groupTests from "../../../../__test__/functions/group";
import userTests from "../../../../__test__/functions/user";

describe("Get channel by id controller", () => {
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

    const getChannelById = makeGetChannelById({ channelDb });
    const getChannelByIdController = makeGetChannelByIdController({
        getChannelById,
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

    test("SUCCESS: get channel by id", async () => {
        const channel = await makeFakeChannel();
        channel.groupId = "123";
        const channelRequest = {
            body: {},
            headers: {},
            ip: "",
            method: "POST",
            params: { channelId: channel.channelId },
            path: "",
            query: {},
        };

        const createdChannel = await createChannel(channel);

        const foundChannel = await getChannelByIdController(channelRequest);
        expect(foundChannel.body.data?.channelId).toBe(channel.channelId);
    });

    test("ERROR: channel id does not exist", async () => {
        const channel = await makeFakeChannel();
        channel.groupId = "123";
        const channelRequest = {
            body: {},
            headers: {},
            ip: "",
            method: "POST",
            params: { channelId: "" },
            path: "",
            query: {},
        };

        const createdChannel = await createChannel(channel);

        const foundChannel = await getChannelByIdController(channelRequest);
        expect(foundChannel.body.error).toBe("Channel Id needs to be supplied");
    });
});
