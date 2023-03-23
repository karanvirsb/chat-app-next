import { IGroupChannel } from "./groupChannel";
import makeChannel from ".";

describe("Channel test", () => {
    const channelData: IGroupChannel = {
        channelId: "123456789",
        channelName: "coolName",
        dateCreated: new Date(),
        groupId: "123456789",
    };
    test("Channel make successfully", () => {
        const channel = makeChannel(channelData);
        expect(channel.getChannelName()).toBe("coolName");
    });

    test("ERROR: name should not contain html", () => {
        expect(() =>
            makeChannel({
                ...channelData,
                channelName: "<html></html>",
            })
        ).toThrow("Channel name should contain valid characters");
    });

    test("ERROR: channel name should be between 3-50", () => {
        expect(() =>
            makeChannel({ ...channelData, channelName: "12" })
        ).toThrow("Channel name should be between 3 to 50 characters long");
    });

    test("ERROR: group id does not exist", () => {
        expect(() => makeChannel({ ...channelData, groupId: "" })).toThrow(
            "Group Id needs to be supplied"
        );
    });

    // test("ERROR: date needed", () => {
    //     expect(() => makeChannel({ ...channelData })).toThrow(
    //         "Date needs to be supplied"
    //     );
    // });

    test("ERROR: channel id is needed", () => {
        expect(() => makeChannel({ ...channelData, channelId: "" })).toThrow(
            "Channel Id needs to be supplied"
        );
    });
});
