import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

import {
  ICreateGroupMessageEvent,
  IDeleteGroupMessageEvent,
  IUpdateGroupMessageEvent,
} from "../types/groupChat";

type props = {
  socket: Socket;
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
};

export function groupChatEvents({ socket, io }: props) {
  socket.on("create_group_message", (data: ICreateGroupMessageEvent) => {
    io.to(data.groupId).emit("new_group_chat_message", data);
  });

  socket.on("update_group_message", (data: IUpdateGroupMessageEvent) => {
    io.to(data.groupId).emit("update_group_chat_message", data);
  });

  socket.on("delete_group_message", (data: IDeleteGroupMessageEvent) => {
    io.to(data.groupId).emit("delete_group_chat_message", data);
  });
}
