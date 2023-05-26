import { faker } from "@faker-js/faker";

import { IPrivateMessage } from "@/server/Features/privateMessage/privateMessage";
import id from "@/server/Utilities/id";

export default async function makeFakePrivateMessage(
  privateChannelId: string,
  userId: string
): Promise<IPrivateMessage> {
  return {
    privateChannelId: privateChannelId,
    dateCreated: new Date(),
    messageId: id.makeId(),
    text: faker.lorem.lines(1),
    userId: userId,
    dateModified: new Date(),
    replyTo: id.makeId(),
  };
}
