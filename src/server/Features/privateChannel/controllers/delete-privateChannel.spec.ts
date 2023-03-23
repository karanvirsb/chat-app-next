import makePrivateChannelDb from "../data-access/privateChannel-db";
import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeCreatePrivateChannel from "../use-cases/createPrivateChannel";
import { moderateName } from "../../../Utilities/moderateText";
import makeFakePrivateChannel from "../../../../__test__/fixures/privateChannel";
import makeDeletePrivateChannelController from "./delete-privateChannel";
import makeDeletePrivateChannel from "../use-cases/deletePrivateChannel";
import userTests from "../../../../__test__/functions/user";

describe("Delete private channel controller", () => {
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
    const createChannel = makeCreatePrivateChannel({
        handleModeration,
        privateChannelDb,
    });

    const deletePrivateChannel = makeDeletePrivateChannel({ privateChannelDb });
    const deletePrivateChannelController = makeDeletePrivateChannelController({
        deletePrivateChannel,
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

    test("SUCCESS: delete channel", async () => {
        const channel = await makeFakePrivateChannel(
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
            "312c0878-04c3-4585-835e-c66900ccc7a1"
        );

        const channelRequest = {
            body: { channelId: channel.channelId },
            headers: {},
            ip: "",
            method: "POST",
            params: {},
            path: "",
            query: {},
        };

        const createdChannel = await createChannel(channel);

        const deletedChannel = await deletePrivateChannelController(
            channelRequest
        );
        expect(deletedChannel.body.data?.channelId).toBe(channel.channelId);
    });

    test("ERROR: channel id does not exist", async () => {
        const channel = await makeFakePrivateChannel(
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
            "312c0878-04c3-4585-835e-c66900ccc7a1"
        );

        const channelRequest = {
            body: { channelId: "" },
            headers: {},
            ip: "",
            method: "POST",
            params: {},
            path: "",
            query: {},
        };

        const createdChannel = await createChannel(channel);

        const deletedChannel = await deletePrivateChannelController(
            channelRequest
        );
        expect(deletedChannel.body.error).toBe(
            "Channel Id needs to be supplied"
        );
    });
});
