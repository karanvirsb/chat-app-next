import socket from "..";
import { groupChannelSocketEvents } from "../SocketHandler";

export default function useGroupChannelSockets() {
  return (event: "update_channel_lists", data: groupChannelSocketEvents) => {
    socket.emit(event, data);
  };
}
