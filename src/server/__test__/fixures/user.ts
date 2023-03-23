import { faker } from "@faker-js/faker";
import cuid from "cuid";
import { IUser } from "../../src/Features/user/user";

export default async function makeFakeUser({
    userId,
}: {
    userId: string;
}): Promise<IUser> {
    return {
        userId,
        username: faker.name.firstName() + faker.color.human(),
        status: "online",
    };
}
