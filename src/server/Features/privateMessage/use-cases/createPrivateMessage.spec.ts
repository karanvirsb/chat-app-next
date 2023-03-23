import makePrivateMessageDb from "../data-access/privateMessage-db";
import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeCreatePrivateMessage from "./createPrivateMessage";
import makeFakePrivateMessage from "../../../../__test__/fixures/privateMessage";
import makePrivateChannelDb from "../../privateChannel/data-access/privateChannel-db";
import userTests from "../../../../__test__/functions/user";
import privateChannelTests from "../../../../__test__/functions/privateChannel";

describe("Create private message use case", () => {
    const privateMessageDb = makePrivateMessageDb({ makeDb });
    const createMessage = makeCreatePrivateMessage({ privateMessageDb });

    jest.setTimeout(30000);
    beforeAll(async () => {
        const addedUser = await userTests.addTestUserToDB({
            userId: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
        });
        const secondUser = await userTests.addTestUserToDB({
            userId: "312c0878-04c3-4585-835e-c66900ccc7a1",
        });
        const privateChannel =
            await privateChannelTests.createTestPrivateChannel({
                userId: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
                friendsId: "312c0878-04c3-4585-835e-c66900ccc7a1",
                channelId: "123",
            });
    });

    afterAll(async () => {
        await clearDb("private_messages");
        const deletedPrivateChannel =
            await privateChannelTests.deleteTestPrivateChannel({
                channelId: "123",
            });
        const deletedUser = await userTests.deleteTestUser({
            userId: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
        });
        const deletedSecondUser = await userTests.deleteTestUser({
            userId: "312c0878-04c3-4585-835e-c66900ccc7a1",
        });
    });

    test("SUCCESS: creating a message", async () => {
        jest.setTimeout(30000);
        const message = await makeFakePrivateMessage(
            "123",
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );
        const insertedMessage = await createMessage(message);

        expect(insertedMessage.data?.messageId).toBe(message.messageId);
    });

    test("ERROR: channelId not given", async () => {
        const message = await makeFakePrivateMessage(
            "123",
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );

        try {
            message.privateChannelId = "";
            const insertedMessage = await createMessage(message);
        } catch (error) {
            if (error instanceof Error)
                expect(error.message).toBe("Channel Id needs to be supplied.");
        }
    });

    test("ERROR: text not given", async () => {
        const message = await makeFakePrivateMessage(
            "123",
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );

        try {
            message.text = "";
            const insertedMessage = await createMessage(message);
        } catch (error) {
            if (error instanceof Error)
                expect(error.message).toBe("Text needs to be supplied.");
        }
    });

    test("ERROR: user id not given", async () => {
        const message = await makeFakePrivateMessage(
            "123",
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );

        try {
            message.userId = "";
            const insertedMessage = await createMessage(message);
        } catch (error) {
            if (error instanceof Error)
                expect(error.message).toBe("User Id needs to be supplied.");
        }
    });
});
