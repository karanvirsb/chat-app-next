import { faker } from "@faker-js/faker";
import cuid from "cuid";
import makeGroupDb from "../../src/Features/group/data-access/group-db";
import makeDb from "../fixures/db";

const groupTests = Object.freeze({ createTestGroup, deleteTestGroup });

export default groupTests;

async function createTestGroup({
    groupId,
    userId,
}: {
    groupId: string;
    userId: string;
}) {
    let groupDb = makeGroupDb({ makeDb });
    const group = {
        groupId,
        groupName: faker.company.bsNoun(),
        inviteCode: cuid.slug(),
        dateCreated: new Date(),
    };

    const addedGroup = await groupDb.createGroup(group, userId);

    return addedGroup;
}

async function deleteTestGroup({
    groupId,
    userId,
}: {
    groupId: string;
    userId: string;
}) {
    let groupDb = makeGroupDb({ makeDb });
    const deletedGroup = await groupDb.removeGroup(groupId);

    return deletedGroup;
}
