import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

import { UpdateChannelsListEvent } from "../types/groupChannel";

type props = {
  socket: Socket;
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
};

export function groupChannelEvents({ socket, io }: props) {
  socket.on("update_channel_lists", (data: UpdateChannelsListEvent) => {
    io.to(data.groupId).emit("update_channel_list", data.payload.channelInfo);
  });
}
