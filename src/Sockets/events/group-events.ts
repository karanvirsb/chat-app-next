import { QueryClient } from "@tanstack/react-query";
import { Socket } from "socket.io-client";

import { IGroup } from "@/server/Features/group/group";
import { IUser } from "@/server/Features/user/user";
import {
  DeleteEvent,
  LeaveGroupEvent,
  UpdateGroupUsersEvent,
} from "@/shared/socket-events/groupEventTypes";

type props = { socket: Socket; queryClient: QueryClient };
export function groupEvents({ socket, queryClient }: props) {
  socket.on("updates_for_group", (data: UseCaseReturn<IGroup>) => {
    queryClient.setQueriesData(["groups"], (oldData: unknown) => {
      return Array.isArray(oldData) && data.success
        ? oldData.map((entity) =>
            entity.groupId === data?.data?.groupId
              ? { ...entity, ...data?.data }
              : entity
          )
        : oldData;
    });
  });

  socket.on("delete_group", (data: DeleteEvent) => {
    queryClient.setQueriesData(["groups"], (oldData: unknown) => {
      const deleteGroup = (group: IGroup) => group.groupId !== data.groupId;
      return Array.isArray(oldData) ? oldData.filter(deleteGroup) : oldData;
    });
  });

  socket.on("update_group_users", (data: UpdateGroupUsersEvent) => {
    queryClient.setQueriesData(
      [`group-users-${data.groupId}`],
      (oldData: unknown) => {
        const pushResult = (arr: IUser[]) => {
          return [...arr, data.payload.userInfo];
        };
        return Array.isArray(oldData) ? pushResult(oldData) : oldData;
      }
    );
  });

  socket.on("removed_user", (data: LeaveGroupEvent) => {
    queryClient.setQueriesData(
      [`group-users-${data.groupId}`],
      (oldData: unknown) => {
        const removeUser = (user: IUser) => user.userId !== data.payload.userId;
        return Array.isArray(oldData) ? oldData.filter(removeUser) : oldData;
      }
    );
  });
}
