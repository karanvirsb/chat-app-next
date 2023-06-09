import { faker } from "@faker-js/faker";

import makePrivateChannelDb from "@/server/Features/privateChannel/data-access/privateChannel-db";
import { IPrivateChannel } from "@/server/Features/privateChannel/privateChannel";

import makeDb from "../fixures/db";

const privateChannelTests = Object.freeze({
  createTestPrivateChannel,
  deleteTestPrivateChannel,
});

export default privateChannelTests;

async function createTestPrivateChannel({
  userId,
  friendsId,
  channelId,
}: {
  userId: string;
  friendsId: string;
  channelId: string;
}) {
  const privateChannelDb = makePrivateChannelDb({ makeDb });

  const channel: IPrivateChannel = {
    channelId,
    channelName: faker.animal.cat(),
    dateCreated: new Date(),
    userId,
    friendsId,
    lastActive: new Date(),
  };

  const createdPrivateChannel = await privateChannelDb.createPrivateChannel(
    channel
  );

  return (
    createdPrivateChannel.success && createdPrivateChannel.data !== undefined
  );
}

async function deleteTestPrivateChannel({ channelId }: { channelId: string }) {
  const privateChannelDb = makePrivateChannelDb({ makeDb });
  const deletedPrivateChannel = await privateChannelDb.deletePrivateChannel(
    channelId
  );
  return (
    deletedPrivateChannel.success && deletedPrivateChannel.data !== undefined
  );
}
