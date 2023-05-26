import { ZodError } from "zod";

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
    if (!result.success) {
      expect(result.error).toBeInstanceOf(ZodError);
      if (result.error instanceof ZodError) {
        const err = (result.error as ZodError<IPrivateChannel>).flatten()
          .fieldErrors;
        console.log(err);
        expect(err.channelName?.join("")).toBe(
          "Channel name has to be atleast 3 characters."
        );
      }
    }
  });

  test("ERROR: channel name should be between 3-50", () => {
    const result = makePrivateChannel({
      ...channelData,
      channelName:
        "fjsdklfjlkdjflkejrlkjsljkfjisldfilejiljtrijljsflkjflkjaelitjlijsifjslkjeif",
    });
    expect(result.success).toBeFalsy();

    if (!result.success) {
      expect(result.error).toBeInstanceOf(ZodError);
      if (result.error instanceof ZodError) {
        const err = (result.error as ZodError<IPrivateChannel>).flatten()
          .fieldErrors;
        console.log(err);
        expect(err.channelName?.join("")).toBe(
          "Channel name cannot be more than 50 characters"
        );
      }
    }
  });

  test("ERROR: user id does not exist", () => {
    const result = makePrivateChannel({ ...channelData, userId: "" });
    expect(result.success).toBeFalsy();

    if (!result.success) {
      expect(result.error).toBeInstanceOf(ZodError);
      if (result.error instanceof ZodError) {
        const err = (result.error as ZodError<IPrivateChannel>).flatten()
          .fieldErrors;
        console.log(err);
        expect(err.userId?.join("")).toBe("Invalid uuid");
      }
    }
  });

  test("ERROR: friends id is needed", () => {
    const result = makePrivateChannel({ ...channelData, friendsId: "" });
    expect(result.success).toBeFalsy();

    if (!result.success) {
      expect(result.error).toBeInstanceOf(ZodError);
      if (result.error instanceof ZodError) {
        const err = (result.error as ZodError<IPrivateChannel>).flatten()
          .fieldErrors;
        console.log(err);
        expect(err.friendsId?.join("")).toBe("Invalid uuid");
      }
    }
  });

  test("ERROR: channel id is needed", () => {
    const result = makePrivateChannel({ ...channelData, channelId: "" });
    expect(result.success).toBeFalsy();

    if (!result.success) {
      expect(result.error).toBeInstanceOf(ZodError);
      if (result.error instanceof ZodError) {
        const err = (result.error as ZodError<IPrivateChannel>).flatten()
          .fieldErrors;
        console.log(err);
        expect(err.channelId?.join("")).toBe("Invalid uuid");
      }
    }
  });
});
