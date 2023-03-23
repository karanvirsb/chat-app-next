import { IPrivateChannel } from "./privateChannel";
import makePrivateChannel from ".";

describe("Channel test", () => {
    const channelData: IPrivateChannel = {
        channelId: "123456789",
        channelName: "coolName",
        dateCreated: new Date(),
        userId: "123456789",
        friendsId: "12345",
        lastActive: new Date(),
    };
    test("Channel make successfully", () => {
        const channel = makePrivateChannel(channelData);
        expect(channel.getChannelName()).toBe("coolName");
    });

    test("ERROR: name should not contain html", () => {
        expect(() =>
            makePrivateChannel({
                ...channelData,
                channelName: "<html></html>",
            })
        ).toThrow("Channel name should contain valid characters");
    });

    test("ERROR: channel name should be between 3-50", () => {
        expect(() =>
            makePrivateChannel({ ...channelData, channelName: "12" })
        ).toThrow("Channel name should be between 3 to 50 characters long");
    });

    test("ERROR: user id does not exist", () => {
        expect(() =>
            makePrivateChannel({ ...channelData, userId: "" })
        ).toThrow("User Id needs to be supplied");
    });

    test("ERROR: friends id is needed", () => {
        expect(() =>
            makePrivateChannel({ ...channelData, friendsId: "" })
        ).toThrow("Friends Id needs to be supplied");
    });

    test("ERROR: channel id is needed", () => {
        expect(() =>
            makePrivateChannel({ ...channelData, channelId: "" })
        ).toThrow("Channel Id needs to be supplied");
    });
});
