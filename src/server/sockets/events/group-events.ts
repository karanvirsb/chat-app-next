import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

import { updateGroupUC } from "@/server/Features/group/updateGroup";
import {
  DeleteEvent,
  LeaveGroupEvent,
  UpdateEvent,
  UpdateGroupUsersEvent,
} from "@/shared/socket-events/groupEventTypes";

type props = {
  socket: Socket;
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
};

export function groupEvents({ socket, io }: props) {
  socket.on("update_group", async (data: UpdateEvent) => {
    const updatedGroup = await updateGroupUC({
      groupId: data.groupId,
      updates: data.group_updates,
    });

    io.to(data.groupId).emit("updates_for_group", updatedGroup);
  });

  socket.on("delete_the_group", (groupData: DeleteEvent) => {
    io.to(groupData.groupId).emit("delete_group", groupData);
  });

  socket.on(
    "update_the_group_users",
    (groupUserData: UpdateGroupUsersEvent) => {
      io.to(groupUserData.groupId).emit("update_group_users", groupUserData);
    }
  );

  socket.on("leave_the_group", (groupUserData: LeaveGroupEvent) => {
    io.to(groupUserData.groupId).emit("removed_user", groupUserData);
  });
}
