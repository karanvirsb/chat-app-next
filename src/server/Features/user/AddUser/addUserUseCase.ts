import { IMakeUsersDb } from "../data-access/users-db";
import makeUser from "../index";
import { handleModerationType } from "../use-cases";
import { IUser } from "../user";

type props = {
  usersDb: IMakeUsersDb["returnType"];
  handleModeration: handleModerationType;
};

export interface IAddUserUseCase {
  addUser: (user: IUser) => Promise<UseCaseReturn<IUser>>;
}

export default function makeAddUser({ usersDb, handleModeration }: props) {
  return async function addUser(
    userInfo: IUser
  ): Promise<UseCaseReturn<IUser>> {
    const user = makeUser(userInfo);
    if (!user.success) {
      return user;
    }
    const exists = await usersDb.findByUsername(user.data.getUsername());

    if (exists.success && exists.data !== undefined) {
      throw new Error("User already exists");
    }

    const moderated = await handleModeration(user.data.getUsername());

    if (moderated) {
      throw new Error("Username contains profanity");
    }

    if (moderated === -1) {
      throw new Error("Server Error, please try again.");
    }

    return await usersDb.insert({
      data: {
        password: user.data.getPassword(),
        status: user.data.getStatus(),
        userId: user.data.getUserId(),
        username: user.data.getUsername(),
      },
    });
  };
}
