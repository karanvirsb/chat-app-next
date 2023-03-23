import makeDeleteUser from "../DeleteUser/deleteUserUseCase";
import makeDeleteUserController from "../DeleteUser/deleteUserController";
import usersDb from "../data-access";

export const deleteUserUC = makeDeleteUser({ usersDb });

export const deleteUserC = makeDeleteUserController({
  deleteUser: deleteUserUC,
});
