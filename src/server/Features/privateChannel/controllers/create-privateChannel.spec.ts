import makePrivateChannelDb from "../data-access/privateChannel-db";
import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeCreatePrivateChannel from "../use-cases/createPrivateChannel";
import { moderateName } from "../../../Utilities/moderateText";
import makeCreatePrivateChannelController from "./create-privateChannel";
import makeFakePrivateChannel from "../../../../__test__/fixures/privateChannel";
import userTests from "../../../../__test__/functions/user";

describe("Create private channel controller", () => {
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

    const privateChannelDb = makePrivateChannelDb({ makeDb });
    const createPrivateChannel = makeCreatePrivateChannel({
        handleModeration,
        privateChannelDb,
    });
    const createPrivateChannelController = makeCreatePrivateChannelController({
        createPrivateChannel,
    });

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
        jest.setTimeout(30000);
        await clearDb("private_channels");
        const deletedUser = await userTests.deleteTestUser({
            userId: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
        });
        const deletedSecondUser = await userTests.deleteTestUser({
            userId: "312c0878-04c3-4585-835e-c66900ccc7a1",
        });
    });

    test("SUCCESS: create channel", async () => {
        const channel = await makeFakePrivateChannel(
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
            "312c0878-04c3-4585-835e-c66900ccc7a1"
        );

        const channelRequest = {
            body: { channelInfo: channel },
            headers: {},
            ip: "",
            method: "POST",
            params: {},
            path: "",
            query: {},
        };

        const createdChannel = await createPrivateChannelController(
            channelRequest
        );
        expect(createdChannel.body.data?.channelName).toBe(channel.channelName);
    });

    test("Error: private channel name not supplied", async () => {
        const channel = await makeFakePrivateChannel(
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
            "312c0878-04c3-4585-835e-c66900ccc7a1"
        );

        const channelRequest = {
            body: { channelInfo: { ...channel, channelName: "" } },
            headers: {},
            ip: "",
            method: "POST",
            params: {},
            path: "",
            query: {},
        };

        const createdChannel = await createPrivateChannelController(
            channelRequest
        );
        expect(createdChannel.body.error).toBe(
            "Channel name should contain valid characters"
        );
    });

    test("Error: user id was not provided", async () => {
        const channel = await makeFakePrivateChannel(
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
            "312c0878-04c3-4585-835e-c66900ccc7a1"
        );

        const channelRequest = {
            body: { channelInfo: { ...channel, userId: "" } },
            headers: {},
            ip: "",
            method: "POST",
            params: {},
            path: "",
            query: {},
        };

        const createdChannel = await createPrivateChannelController(
            channelRequest
        );
        expect(createdChannel.body.error).toBe("User Id needs to be supplied");
    });

    test("Error: private channel name contains profanity", async () => {
        const channel = await makeFakePrivateChannel(
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
            "312c0878-04c3-4585-835e-c66900ccc7a1"
        );

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

        const createdChannel = await createPrivateChannelController(
            channelRequest
        );
        expect(createdChannel.body.error).toBe(
            "Channel name contains profanity"
        );
    });
});
