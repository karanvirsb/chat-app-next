import { faker } from "@faker-js/faker";

import { IPrivateChannel } from "@/server/Features/privateChannel/privateChannel";
import id from "@/server/Utilities/id";

export default async function makeFakePrivateChannel(
  userId: string,
  friendsId: string
): Promise<IPrivateChannel> {
  return {
    channelId: id.makeId(),
    channelName: faker.animal.cat().toString(),
    dateCreated: new Date(),
    userId,
    friendsId,
    lastActive: new Date(),
  };
}
