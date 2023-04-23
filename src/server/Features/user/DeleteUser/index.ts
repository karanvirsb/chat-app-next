import usersDb from "../data-access";
import makeDeleteUserController from "../DeleteUser/deleteUserController";
import makeDeleteUser from "../DeleteUser/deleteUserUseCase";

export const deleteUserUC = makeDeleteUser({ usersDb });

export const deleteUserC = makeDeleteUserController({
  deleteUser: deleteUserUC,
});
