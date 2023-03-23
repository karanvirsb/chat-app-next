import makePrivateChannelDb from "../data-access/privateChannel-db";
import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeCreatePrivateChannel, {
    handleModerationType,
} from "./createPrivateChannel";
import { moderateName } from "../../../Utilities/moderateText";
import makeFakePrivateChannel from "../../../../__test__/fixures/privateChannel";
import userTests from "../../../../__test__/functions/user";

describe("creating private channel use case", () => {
    const handleModeration: handleModerationType = async (
        channelName: string
    ) => {
        return await moderateName(channelName);
    };
    const privateChannelDb = makePrivateChannelDb({ makeDb });
    const createPrivateChannel = makeCreatePrivateChannel({
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

    test("SUCCESS: created private channel", async () => {
        const channel = await makeFakePrivateChannel(
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
            "312c0878-04c3-4585-835e-c66900ccc7a1"
        );

        const createdChannel = await createPrivateChannel(channel);

        expect(createdChannel.data?.channelName).toBe(channel.channelName);
    });

    test("ERROR: channel name was not provided", async () => {
        const channel = await makeFakePrivateChannel(
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
            "312c0878-04c3-4585-835e-c66900ccc7a1"
        );
        channel.channelName = "";
        try {
            const createdChannel = await createPrivateChannel(channel);
        } catch (err) {
            if (err instanceof Error)
                expect(err.message).toBe(
                    "Channel name should contain valid characters"
                );
        }
    });

    test("ERROR: user id was not provided", async () => {
        const channel = await makeFakePrivateChannel(
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
            "312c0878-04c3-4585-835e-c66900ccc7a1"
        );

        channel.userId = "";

        try {
            const createdChannel = await createPrivateChannel(channel);
        } catch (err) {
            if (err instanceof Error)
                expect(err.message).toBe("User Id needs to be supplied");
        }
    });

    test("ERROR: friends id was not provided", async () => {
        const channel = await makeFakePrivateChannel(
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
            "312c0878-04c3-4585-835e-c66900ccc7a1"
        );

        channel.friendsId = "";

        try {
            const createdChannel = await createPrivateChannel(channel);
        } catch (err) {
            if (err instanceof Error)
                expect(err.message).toBe("Friends Id needs to be supplied");
        }
    });
});
