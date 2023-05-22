import { faker } from "@faker-js/faker";
import cuid from "cuid";

import { IGroup } from "@/server/Features/group/group";
import id from "@/server/Utilities/id";

export default async function makeFakeGroup(): Promise<IGroup> {
  return {
    groupId: id.makeId(),
    groupName: faker.company.bsNoun(),
    inviteCode: cuid.slug(),
    dateCreated: new Date(),
  };
}
