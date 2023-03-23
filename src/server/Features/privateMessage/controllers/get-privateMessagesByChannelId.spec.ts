import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeFakePrivateMessage from "../../../../__test__/fixures/privateMessage";
import privateChannelTests from "../../../../__test__/functions/privateChannel";
import userTests from "../../../../__test__/functions/user";
import makePrivateChannelDb from "../../privateChannel/data-access/privateChannel-db";
import makePrivateMessageDb from "../data-access/privateMessage-db";
import makeCreatePrivateMessage from "../use-cases/createPrivateMessage";
import makeGetPrivateMessagesByChannelId from "../use-cases/getPrivateMessagesByChannelId";
import makeGetPrivateMessagesByChannelIdController from "./get-privateMessagesByChannelId";

describe("getting private messages by channel id controller", () => {
    const privateMessageDb = makePrivateMessageDb({ makeDb });
    const createMessage = makeCreatePrivateMessage({ privateMessageDb });

    const getPrivateMessagesByChannelId = makeGetPrivateMessagesByChannelId({
        privateMessageDb,
    });
    const getPrivateMessagesByChannelIdController =
        makeGetPrivateMessagesByChannelIdController({
            getPrivateMessagesByChannelId,
        });

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

    test("SUCCESS: getting a message", async () => {
        const message = await makeFakePrivateMessage(
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

        const foundMessage = await getPrivateMessagesByChannelIdController(
            messageRequest
        );
        if (foundMessage.body.data)
            expect(foundMessage.body.data[0].text).toBe(message.text);
    });

    test("ERROR: message id missing ", async () => {
        const message = await makeFakePrivateMessage(
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

        const foundMessages = await getPrivateMessagesByChannelIdController(
            messageRequest
        );

        expect(foundMessages.body.error).toBe(
            "Message Id needs to be supplied."
        );
    });

    test("ERROR: date created missing ", async () => {
        const message = await makeFakePrivateMessage(
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

        const foundMessages = await getPrivateMessagesByChannelIdController(
            messageRequest
        );

        expect(foundMessages.body.error).toBe(
            "Date Created needs to be supplied."
        );
    });
});
