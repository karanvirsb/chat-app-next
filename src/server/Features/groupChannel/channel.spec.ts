import id from "@/server/Utilities/id";

import makeChannel from ".";
import { IGroupChannel } from "./groupChannel";

describe("Channel test", () => {
  const channelData: IGroupChannel = {
    channelId: id.makeId(),
    channelName: "coolName",
    dateCreated: new Date(),
    groupId: id.makeId(),
  };
  test("Channel make successfully", () => {
    const channel = makeChannel(channelData);
    expect(channel.success).toBeTruthy();
    if (channel.success) expect(channel.data.getChannelName()).toBe("coolName");
  });

  test("ERROR: name should not contain html", () => {
    const result = makeChannel({
      ...channelData,
      channelName: "<html></html>",
    });
    expect(result.success).toBeFalsy();
  });

  test("ERROR: channel name should be between 3-50", () => {
    const result = makeChannel({ ...channelData, channelName: "12" });
    expect(result.success).toBeFalsy();
  });

  test("ERROR: group id does not exist", () => {
    const result = makeChannel({ ...channelData, groupId: "" });
    expect(result.success).toBeFalsy();
  });

  // test("ERROR: date needed", () => {
  //     expect(() => makeChannel({ ...channelData })).toThrow(
  //         "Date needs to be supplied"
  //     );
  // });

  test("ERROR: channel id is needed", () => {
    const result = makeChannel({ ...channelData, channelId: "" });
    expect(result.success).toBeFalsy();
  });
});
