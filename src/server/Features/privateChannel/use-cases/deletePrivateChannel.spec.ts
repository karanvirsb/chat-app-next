import makePrivateChannelDb from "../data-access/privateChannel-db";
import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeCreatePrivateChannel, {
    handleModerationType,
} from "./createPrivateChannel";
import makeDeletePrivateChannel from "./deletePrivateChannel";
import { moderateName } from "../../../Utilities/moderateText";
import makeFakePrivateChannel from "../../../../__test__/fixures/privateChannel";
import userTests from "../../../../__test__/functions/user";

describe("deleting private channel use case", () => {
    const handleModeration: handleModerationType = async (
        channelName: string
    ) => {
        return await moderateName(channelName);
    };

    const privateChannelDb = makePrivateChannelDb({ makeDb });
    const deleteChannel = makeDeletePrivateChannel({
        privateChannelDb,
    });
    const createChannel = makeCreatePrivateChannel({
        handleModeration,
        privateChannelDb,
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
        await clearDb("private_channels");
        const deletedUser = await userTests.deleteTestUser({
            userId: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
        });
        const deletedSecondUser = await userTests.deleteTestUser({
            userId: "312c0878-04c3-4585-835e-c66900ccc7a1",
        });
    });

    test("SUCCESS: deleting private channel", async () => {
        const channel = await makeFakePrivateChannel(
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
            "312c0878-04c3-4585-835e-c66900ccc7a1"
        );

        const addedChannel = await createChannel(channel);

        const deletedChannel = await deleteChannel(channel.channelId);
        expect(deletedChannel.data?.channelId).toBe(channel.channelId);
    });

    test("ERROR: channel id not provided", async () => {
        const channel = await await makeFakePrivateChannel(
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
            "312c0878-04c3-4585-835e-c66900ccc7a1"
        );

        const addedChannel = await createChannel(channel);

        try {
            const deletedChannel = await deleteChannel("");
        } catch (error) {
            if (error instanceof Error)
                expect(error.message).toBe("Channel Id needs to be supplied");
        }
    });
});
