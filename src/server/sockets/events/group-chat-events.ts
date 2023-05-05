import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

import { createMessage } from "@/server/Features/groupMessage/use-cases";
import {
  groupChatEventDataTypes,
  groupChatEventsTypes,
} from "@/shared/socket-events/groupChatTypes";

type props = {
  socket: Socket;
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
};

export function groupChatEvents({ socket, io }: props) {
  socket.on(
    groupChatEventsTypes.NEW_MESSAGE.send,
    async (data: groupChatEventDataTypes["NEW_MESSAGE"]["send"]) => {
      const createdMessage = await createMessage(data.payload.messageInfo);
      if (createdMessage.success) {
        io.to(data.groupId).emit(groupChatEventsTypes.NEW_MESSAGE.broadcast, {
          ...data,
          payload: { messageInfo: createdMessage.data },
        });
      } else {
        io.to(data.groupId).emit(groupChatEventsTypes.NEW_MESSAGE.error, {
          error: createdMessage.error,
        });
      }
    }
  );

  socket.on(
    groupChatEventsTypes.UPDATE_MESSAGE.send,
    (data: groupChatEventDataTypes["UPDATE_MESSAGE"]["send"]) => {
      io.to(data.groupId).emit(
        groupChatEventsTypes.UPDATE_MESSAGE.broadcast,
        data
      );
    }
  );

  socket.on(
    groupChatEventsTypes.DELETE_MESSAGE.send,
    (data: groupChatEventDataTypes["DELETE_MESSAGE"]["send"]) => {
      io.to(data.groupId).emit(
        groupChatEventsTypes.DELETE_MESSAGE.broadcast,
        data
      );
    }
  );
}
