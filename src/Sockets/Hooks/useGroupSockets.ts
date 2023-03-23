import socket from "..";
import { groupSocketEvents } from "../SocketHandler";

export default function useGroupSockets() {
  return (
    event:
      | "updated_group_name"
      | "delete_the_group"
      | "join_rooms"
      | "update_the_group_users"
      | "leave_room"
      | "leave_the_group",
    data: groupSocketEvents
  ) => {
    socket.emit(event, data);
  };
}
