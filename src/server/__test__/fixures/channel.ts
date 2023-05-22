import { faker } from "@faker-js/faker";
import cuid from "cuid";

import { IGroupChannel } from "@/server/Features/groupChannel/groupChannel";

export default async function makeFakeChannel({
  groupId,
}: {
  groupId: string;
}): Promise<IGroupChannel> {
  return {
    channelId: cuid(),
    channelName: faker.animal.cat().toString(),
    dateCreated: new Date(),
    groupId,
  };
}
