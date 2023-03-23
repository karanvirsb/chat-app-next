import makePrivateMessageDb from "../data-access/privateMessage-db";
import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeCreatePrivateMessage from "./createPrivateMessage";
import makeFakePrivateMessage from "../../../../__test__/fixures/privateMessage";
import makePrivateChannelDb from "../../privateChannel/data-access/privateChannel-db";
import makeDeletePrivateMessage from "./deletePrivateMessage";
import privateChannelTests from "../../../../__test__/functions/privateChannel";
import userTests from "../../../../__test__/functions/user";

describe("Deleting a private message use case", () => {
    const privateMessageDb = makePrivateMessageDb({ makeDb });
    const createPrivateMessage = makeCreatePrivateMessage({ privateMessageDb });
    const deletePrivateMessage = makeDeletePrivateMessage({ privateMessageDb });

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

    test("SUCCESS: deleting a message", async () => {
        const message = await makeFakePrivateMessage(
            "123",
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );
        const insertedMessage = await createPrivateMessage(message);

        const deletedMessage = await deletePrivateMessage(message.messageId);

        expect(deletedMessage.data?.messageId).toBe(message.messageId);
    });

    test("ERROR: message id is missing", async () => {
        const message = await makeFakePrivateMessage(
            "123",
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );
        const insertedMessage = await createPrivateMessage(message);

        try {
            const deletedMessage = await deletePrivateMessage("");
        } catch (error) {
            if (error instanceof Error)
                expect(error.message).toBe("Message Id needs to be supplied.");
        }
    });
});
