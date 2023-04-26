import { QueryClient } from "@tanstack/react-query";
import produce from "immer";
import { Socket } from "socket.io-client";

import { IUser } from "@/server/Features/user/user";

import { areGroupUsers } from "../../../test/validation/schemaValidation";
import { IChangeUserStatus } from "../types/loginAndLogoutTypes";

type props = {
  socket: Socket;
  queryClient: QueryClient;
};
export function userEvents({ socket, queryClient }: props) {
  socket.on("logged_user_out", (data: IChangeUserStatus) => {
    queryClient.setQueryData(
      [`group-users-${data.payload}`],
      (oldData: unknown) => {
        console.log("logged_user_out client", oldData, data);
        const filterResult = (users: IUser[]) => {
          const updatedValue = produce(users, (draft) => {
            const foundIndex = draft.findIndex(
              (user) => user.userId === data.userId
            );
            if (foundIndex !== -1) draft[foundIndex].status = "offline";
          });
          return updatedValue;
        };

        return Array.isArray(oldData) && areGroupUsers(oldData)
          ? filterResult(oldData)
          : oldData;
      }
    );
  });

  socket.on("logged_user_in", (data: IChangeUserStatus) => {
    queryClient.setQueryData(
      [`group-users-${data.payload}`],
      (oldData: unknown) => {
        console.log("logged_user_in client", oldData, data);
        const filterResult = (users: IUser[]) => {
          const updatedValue = produce(users, (draft) => {
            const foundIndex = draft.findIndex(
              (user) => user.userId === data.userId
            );
            if (foundIndex !== -1) draft[foundIndex].status = "online";
          });
          return updatedValue;
        };
        return Array.isArray(oldData) && areGroupUsers(oldData)
          ? filterResult(oldData)
          : oldData;
      }
    );
  });
}
