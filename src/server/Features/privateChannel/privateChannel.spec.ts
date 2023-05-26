import makePrivateChannel from ".";
import { IPrivateChannel } from "./privateChannel";

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
    if (channel.success) expect(channel.data.getChannelName()).toBe("coolName");
  });

  test("ERROR: name should not contain html", () => {
    const result = makePrivateChannel({
      ...channelData,
      channelName: "<html></html>",
    });
    expect(result.success).toBeFalsy();
  });

  test("ERROR: channel name should be between 3-50", () => {
    const result = makePrivateChannel({ ...channelData, channelName: "12" });
    expect(result.success).toBeFalsy();
  });

  test("ERROR: user id does not exist", () => {
    const result = makePrivateChannel({ ...channelData, userId: "" });
    expect(result.success).toBeFalsy();
  });

  test("ERROR: friends id is needed", () => {
    const result = makePrivateChannel({ ...channelData, friendsId: "" });
    expect(result.success).toBeFalsy();
  });

  test("ERROR: channel id is needed", () => {
    const result = makePrivateChannel({ ...channelData, channelId: "" });
    expect(result.success).toBeFalsy();
  });
});
