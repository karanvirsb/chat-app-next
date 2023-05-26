import { faker } from "@faker-js/faker";

import { IGroupMessage } from "@/server/Features/groupMessage/groupMessage";
import id from "@/server/Utilities/id";

export default async function makeFakeMessage(
  channelId: string,
  userId: string
): Promise<IGroupMessage> {
  return {
    channelId: channelId,
    dateCreated: new Date().getTime(),
    messageId: id.makeId(),
    text: faker.lorem.lines(1),
    userId: userId,
    dateModified: new Date().getTime(),
    replyTo: id.makeId(),
  };
}
