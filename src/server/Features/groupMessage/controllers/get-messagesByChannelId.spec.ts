import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeFakeMessage from "../../../../__test__/fixures/message";
import groupTests from "../../../../__test__/functions/group";
import channelTests from "../../../../__test__/functions/groupChannel";
import userTests from "../../../../__test__/functions/user";
import makeMessageDb from "../data-access/message-db";
import makeCreateMessage from "../use-cases/createMessage";
import makeGetMessagesByChannelId from "../use-cases/getMessagesByChannelId";
import makeGetMessagesByChannelIdController from "./get-messagesByChannelId";

describe("getting messages by channel id controller", () => {
    const messageDb = makeMessageDb({ makeDb });
    const createMessage = makeCreateMessage({ messageDb });

    const getMessagesByChannelId = makeGetMessagesByChannelId({ messageDb });
    const getMessagesByChannelIdController =
        makeGetMessagesByChannelIdController({
            getMessagesByChannelId,
        });

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
    test("SUCCESS: getting a message", async () => {
        const message = await makeFakeMessage(
            "123",
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );
        const messageRequest = {
            body: {},
            headers: {},
            ip: "",
            method: "",
            params: {
                messageId: message.messageId,
                dateCreated: message.dateCreated.toString(),
                limit: "10",
            },
            path: "",
            query: {},
        };

        const createdMessage = await createMessage(message);

        const foundMessage = await getMessagesByChannelIdController(
            messageRequest
        );
        if (foundMessage.body.data)
            expect(foundMessage.body.data[0].text).toBe(message.text);
    });

    test("ERROR: message id missing ", async () => {
        const message = await makeFakeMessage(
            "123",
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );
        const messageRequest = {
            body: {},
            headers: {},
            ip: "",
            method: "",
            params: {
                messageId: "",
                dateCreated: message.dateCreated.toString(),
                limit: "10",
            },
            path: "",
            query: {},
        };

        const createdMessage = await createMessage(message);

        const foundMessages = await getMessagesByChannelIdController(
            messageRequest
        );

        expect(foundMessages.body.error).toBe(
            "Message Id needs to be supplied."
        );
    });

    test("ERROR: date created missing ", async () => {
        const message = await makeFakeMessage(
            "123",
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );
        const messageRequest = {
            body: {},
            headers: {},
            ip: "",
            method: "",
            params: {
                messageId: message.messageId,
                dateCreated: "",
                limit: "10",
            },
            path: "",
            query: {},
        };

        const createdMessage = await createMessage(message);

        const foundMessages = await getMessagesByChannelIdController(
            messageRequest
        );

        expect(foundMessages.body.error).toBe(
            "Date Created needs to be supplied."
        );
    });
});
