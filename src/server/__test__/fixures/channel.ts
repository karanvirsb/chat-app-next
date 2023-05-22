import { faker } from "@faker-js/faker";

import { IGroupChannel } from "@/server/Features/groupChannel/groupChannel";
import id from "@/server/Utilities/id";

export default async function makeFakeChannel({
  groupId,
}: {
  groupId: string;
}): Promise<IGroupChannel> {
  return {
    channelId: id.makeId(),
    channelName: faker.animal.cat().toString(),
    dateCreated: new Date(),
    groupId,
  };
}
