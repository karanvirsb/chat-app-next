import usersDb from "../data-access";
import buildGetUserByUsername from "./getUserByUsername";

const getUserByUsername = buildGetUserByUsername({ usersDb });

export { getUserByUsername };
