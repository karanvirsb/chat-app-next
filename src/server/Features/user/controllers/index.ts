import { getUser, editUser } from "../use-cases";
import makeEditUser from "./edit-user";
import makeGetUser from "./get-user";

const getAnUser = makeGetUser({ getUser });
const editAnUser = makeEditUser({ editUser });

const userController = Object.freeze({
  getAnUser,
  editAnUser,
});
export default userController;

export { getAnUser, editAnUser };
