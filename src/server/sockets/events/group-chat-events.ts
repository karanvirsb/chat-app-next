import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

import { groupChatEventsTypes } from "@/shared/socket-events/groupChatTypes";

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
  socket.on(
    groupChatEventsTypes.NEW_MESSAGE.send,
    (data: ICreateGroupMessageEvent) => {
      io.to(data.groupId).emit(
        groupChatEventsTypes.NEW_MESSAGE.broadcast,
        data
      );
    }
  );

  socket.on(
    groupChatEventsTypes.UPDATE_MESSAGE.send,
    (data: IUpdateGroupMessageEvent) => {
      io.to(data.groupId).emit(
        groupChatEventsTypes.UPDATE_MESSAGE.broadcast,
        data
      );
    }
  );

  socket.on(
    groupChatEventsTypes.DELETE_MESSAGE.send,
    (data: IDeleteGroupMessageEvent) => {
      io.to(data.groupId).emit(
        groupChatEventsTypes.DELETE_MESSAGE.broadcast,
        data
      );
    }
  );
}
