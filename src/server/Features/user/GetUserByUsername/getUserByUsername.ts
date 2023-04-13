import { IMakeUsersDb } from "../data-access/users-db";

type props = {
  usersDb: IMakeUsersDb["returnType"];
};

export default function buildGetUserByUsername({ usersDb }: props) {
  return async function makeGetUserByUsername({
    username,
  }: {
    username: string;
  }) {
    if (username.length < 4) throw Error("Username must be greater than 4");

    return await usersDb.findByUsername(username);
  };
}
