import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

import {
  createChannel,
  deleteChannel,
} from "@/server/Features/groupChannel/use-cases";
import { TGroupChannelEvents } from "@/shared/socket-events/groupChannelTypes";

import { UpdateChannelsListEvent } from "../types/groupChannel";

type props = {
  socket: Socket;
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
};

export function groupChannelEvents({ socket, io }: props) {
  socket.on(
    TGroupChannelEvents.ADD_CHANNEL.send,
    async (data: UpdateChannelsListEvent) => {
      const result = await createChannel(data);
      if (!result.success) {
        socket.emit(TGroupChannelEvents.ADD_CHANNEL.error, result.error);
        return;
      }
      io.to(data.groupId).emit(TGroupChannelEvents.ADD_CHANNEL.broadcast, {
        success: true,
        data: result.data,
      });
    }
  );

  socket.on(
    TGroupChannelEvents.DELETE_CHANNEL.send,
    async (data: { groupId: string; channelId: string }) => {
      const result = await deleteChannel(data.channelId);
      if (!result.success) {
        socket.emit(TGroupChannelEvents.DELETE_CHANNEL.error, result.error);
        return;
      }
      io.to(data.groupId).emit(
        TGroupChannelEvents.DELETE_CHANNEL.broadcast,
        data
      );
    }
  );
}
