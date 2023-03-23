import makeChannelDb from "../data-access/channel-db";
import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeCreateChannel from "../use-cases/createChannel";
import { moderateName } from "../../../Utilities/moderateText";
import makeFakeChannel from "../../../../__test__/fixures/channel";
import makeGetChannelsByGroupIdController from "./get-channelsByGroupId";
import makeGetChannelsByGroupId from "../use-cases/getChannelsByGroupId";
import groupTests from "../../../../__test__/functions/group";
import userTests from "../../../../__test__/functions/user";

describe("Get channels by group id controller", () => {
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

    const getChannelsByGroupId = makeGetChannelsByGroupId({ channelDb });
    const getChannelsByGroupIdController = makeGetChannelsByGroupIdController({
        getChannelsByGroupId,
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

    test("SUCCESS: get channel by group id", async () => {
        const channel = await makeFakeChannel();
        channel.groupId = "123";
        const channelRequest = {
            body: {},
            headers: {},
            ip: "",
            method: "POST",
            params: { groupId: channel.groupId },
            path: "",
            query: {},
        };

        const createdChannel = await createChannel(channel);

        const foundChannels = await getChannelsByGroupIdController(
            channelRequest
        );
        if (foundChannels.body.data)
            expect(foundChannels.body.data[0].channelId).toBe(
                channel.channelId
            );
    });

    test("ERROR: group id does not exist", async () => {
        const channel = await makeFakeChannel();
        channel.groupId = "123";
        const channelRequest = {
            body: {},
            headers: {},
            ip: "",
            method: "POST",
            params: { groupId: "" },
            path: "",
            query: {},
        };

        const createdChannel = await createChannel(channel);

        const foundChannels = await getChannelsByGroupIdController(
            channelRequest
        );
        expect(foundChannels.body.error).toBe("Group Id needs to be supplied");
    });
});
