import makeFakeChannel from "../../../../__test__/fixures/channel";
import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeFakeMessage from "../../../../__test__/fixures/message";
import groupTests from "../../../../__test__/functions/group";
import channelTests from "../../../../__test__/functions/groupChannel";
import userTests from "../../../../__test__/functions/user";
import makeMessageDb from "./message-db";

describe("Message db method tests", () => {
    jest.setTimeout(10000);
    const messageDB = makeMessageDb({ makeDb });

    beforeAll(async () => {
        jest.setTimeout(30000);
        const addedUser = await userTests.addTestUserToDB({
            userId: "1234",
        });
        const addedGroup = await groupTests.createTestGroup({
            groupId: "123",
            userId: "1234",
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
            userId: "1234",
        });
        const deletedUser = await userTests.deleteTestUser({
            userId: "1234",
        });
    });

    test("SUCCESS: creating a message", async () => {
        const message = await makeFakeMessage("123", "1234");

        const insertedMessage = await messageDB.createMessage(message);
        expect(insertedMessage.data?.messageId).toBe(message.messageId);
    });

    test("SUCCESS: deleting a message", async () => {
        jest.setTimeout(30000);
        const message = await makeFakeMessage("123", "1234");

        const insertedMessage = await messageDB.createMessage(message);
        const deletedMessage = await messageDB.deleteMessage(message.messageId);
        expect(deletedMessage.data?.messageId).toBe(message.messageId);
    });

    test("SUCCESS: getting message by id", async () => {
        jest.setTimeout(30000);
        const message = await makeFakeMessage("123", "1234");

        const insertedMessage = await messageDB.createMessage(message);
        const foundMessage = await messageDB.getMessageById(message.messageId);
        expect(foundMessage.data?.text).toBe(message.text);
    });

    test("SUCCESS: getting messages by channel id", async () => {
        jest.setTimeout(30000);
        let message = await makeFakeMessage("123", "1234");
        let insertedMessage = await messageDB.createMessage(message);
        for (let i = 0; i < 10; i++) {
            message = await makeFakeMessage("123", "1234");

            insertedMessage = await messageDB.createMessage(message);
        }
        const foundMessages = await messageDB.getMessagesByChannelId(
            "123",
            message.dateCreated,
            10
        );
        console.log(foundMessages);
        if (foundMessages.data && insertedMessage.data)
            expect(foundMessages.data[1].text).toBe(insertedMessage.data.text);
    });

    test("SUCCESS: updating message", async () => {
        jest.setTimeout(30000);
        const message = await makeFakeMessage("123", "1234");

        const insertedMessage = await messageDB.createMessage(message);
        const updatedMessage = await messageDB.updateMessage(
            "text",
            message.messageId,
            "'Coders are cool'"
        );
        expect(updatedMessage.data?.text).toBe("Coders are cool");
    });

    test("SUCCESS: updating message date", async () => {
        jest.setTimeout(30000);
        const message = await makeFakeMessage("123", "1234");

        const insertedMessage = await messageDB.createMessage(message);
        const updatedMessage = await messageDB.updateMessage(
            "dateModified",
            message.messageId,
            `to_timestamp(${new Date().getTime() / 1000})`
        );

        expect(updatedMessage.data?.dateModified).not.toEqual(
            message.dateModified
        );
    });
});
