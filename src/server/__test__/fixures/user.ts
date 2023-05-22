import { faker } from "@faker-js/faker";

import { IUser } from "@/server/Features/user/user";
import id from "@/server/Utilities/id";

export default async function makeFakeUser({
  userId,
}: {
  userId: string;
}): Promise<IUser> {
  return {
    userId,
    username: faker.name.firstName() + faker.color.human(),
    password: id.makeId(),
    status: "online",
  };
}
