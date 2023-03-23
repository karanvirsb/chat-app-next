import makeMessageDb from "../data-access/message-db";
import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeDeleteMessage from "./deleteMessage";
import makeCreateMessage from "./createMessage";
import makeFakeMessage from "../../../../__test__/fixures/message";
import userTests from "../../../../__test__/functions/user";
import groupTests from "../../../../__test__/functions/group";
import channelTests from "../../../../__test__/functions/groupChannel";

describe("Deleting a message use case", () => {
    const messageDb = makeMessageDb({ makeDb });
    const createMessage = makeCreateMessage({ messageDb });
    const deleteMessage = makeDeleteMessage({ messageDb });

    beforeAll(async () => {
        jest.setTimeout(30000);
        const addedUser = await userTests.addTestUserToDB({
            userId: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
        });
        const addedGroup = await groupTests.createTestGroup({
            groupId: "123",
            userId: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
        });
        const addedChannel = await channelTests.createTestChannel({
            groupId: "123",
            channelId: "123",
        });
    });

    afterAll(async () => {
        await clearDb("group_messages");
        const deletedChannel = await channelTests.deleteTestChannel({
            channelId: "123",
        });
        const deletedGroup = await groupTests.deleteTestGroup({
            groupId: "123",
            userId: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
        });
        const deletedUser = await userTests.deleteTestUser({
            userId: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
        });
    });

    test("SUCCESS: deleting a message", async () => {
        const message = await makeFakeMessage(
            "123",
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );
        const insertedMessage = await createMessage(message);

        const deletedMessage = await deleteMessage(message.messageId);

        expect(deletedMessage.data?.messageId).toBe(message.messageId);
    });

    test("ERROR: message id is missing", async () => {
        const message = await makeFakeMessage(
            "123",
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );
        const insertedMessage = await createMessage(message);

        try {
            const deletedMessage = await deleteMessage("");
        } catch (error) {
            if (error instanceof Error)
                expect(error.message).toBe("Message Id needs to be supplied.");
        }
    });
});
