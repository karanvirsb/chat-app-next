import { faker } from "@faker-js/faker";
import cuid from "cuid";
import { IGroup } from "../../src/Features/group/group";

export default async function makeFakeGroup(): Promise<IGroup> {
    return {
        groupId: cuid(),
        groupName: faker.company.bsNoun(),
        inviteCode: cuid.slug(),
        dateCreated: new Date(),
    };
}
