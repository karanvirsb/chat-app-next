import makeFakePrivateMessage from "@/server/__test__/fixures/privateMessage";
import id from "@/server/Utilities/id";

import makePrivateMessage from ".";

describe("private message tests", () => {
  const uuid = id.makeId();
  test("SUCCESS: message created", async () => {
    const message = makePrivateMessage(
      await makeFakePrivateMessage(uuid, uuid)
    );
    if (message.success) expect(message.data.getPrivateChannelId()).toBe(uuid);
  });

  test("ERROR: text contains html", async () => {
    const fakeMessage = await makeFakePrivateMessage(uuid, uuid);
    fakeMessage.text = "<html></html>";
    const result = makePrivateMessage(fakeMessage);

    expect(result.success).toBeFalsy();
  });

  test("ERROR: text needs to 1-200 characters long", async () => {
    const fakeMessage = await makeFakePrivateMessage(uuid, uuid);
    fakeMessage.text =
      "sollicitudin aliquam ultrices sagittis orci a scelerisque purus semper eget duis at tellus at urna condimentum mattis pellentesque id nibh tortor id aliquet lectus proin nibh nisl condimentum id venenatis a condimentum vitae sapien pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas sed tempus urna et pharetra pharetra massa massa ultricies mi quis hendrerit dolor magna eget est lorem ipsum dolor sit amet consectetur adipiscing elit pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas integer eget aliquet nibh praesent tristique magna sit amet purus gravida quis blandit turpis cursus in hac habitasse platea dictumst quisque sagittis purus sit amet volutpat consequat mauris nunc congue nisi vitae suscipit tellus mauris a diam maecenas sed enim ut sem viverra aliquet eget sit amet tellus cras adipiscing enim eu turpis egestas pretium aenean pharetra magna ac placerat vestibulum lectus mauris ultrices eros in cursus turpis massa tincidunt dui ut ornare lectus sit amet est placerat in egestas erat imperdiet sed euismod nisi porta lorem mollis aliquam ut porttitor leo a diam sollicitudin tempor id eu nisl nunc mi ipsum faucibus vitae aliquet nec ullamcorper sit amet risus nullam eget felis eget nunc lobortis mattis";
    const result = makePrivateMessage(fakeMessage);

    expect(result.success).toBeFalsy();
  });

  test("ERROR: missing user id", async () => {
    const fakeMessage = await makeFakePrivateMessage(uuid, "");

    const result = makePrivateMessage(fakeMessage);

    expect(result.success).toBeFalsy();
  });

  test("ERROR: missing message id", async () => {
    const fakeMessage = await makeFakePrivateMessage(uuid, uuid);
    fakeMessage.messageId = "";
    const result = makePrivateMessage(fakeMessage);

    expect(result.success).toBeFalsy();
  });

  test("ERROR: missing channel id", async () => {
    const fakeMessage = await makeFakePrivateMessage("", uuid);

    const result = makePrivateMessage(fakeMessage);

    expect(result.success).toBeFalsy();
  });
});
