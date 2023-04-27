import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

import { editUser } from "@/server/Features/user/use-cases";

import { LeaveRoomEvent } from "../types/group";
import { ILogoutEvent } from "../types/user";

type props = {
  socket: Socket;
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
};

const MAX_TIMEOUT = 240000; // 3 mins
export function userEvents(
  socket: Socket,
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
  console.log("here ");
  let droppedConnectionTimeout: NodeJS.Timeout;
  socket.on(
    "join_rooms",
    joinRooms(socket, () =>
      setCheckDroppedConnection(socket, droppedConnectionTimeout, io)
    )
  );

  socket.on("leave_room", (data: LeaveRoomEvent) => {
    socket.leave(data.groupId);
  });

  socket.on("login_user", async (data: ILogoutEvent) => {
    await editUser({ userId: data.userId, updates: { status: "online" } });
    data.payload.groupIds.forEach((groupId) => {
      io.to(groupId).emit("logged_user_in", {
        userId: data.userId,
        payload: groupId,
      });
    });
  });

  socket.on("logout_user", async (data: ILogoutEvent) => {
    await editUser({ userId: data.userId, updates: { status: "offline" } });
    data.payload.groupIds.forEach((groupId) => {
      console.log(data.userId, groupId);
      io.to(groupId).emit("logged_user_out", {
        userId: data.userId,
        payload: groupId,
      });
    });
  });
}

function joinRooms(
  socket: Socket,
  setCheckDroppedConnection: () => void
): (...args: any[]) => void {
  return ({ rooms, userId }: { rooms: string | string[]; userId: string }) => {
    socket.data["userId"] = userId;
    setCheckDroppedConnection();
    console.log(
      `socketId: ${socket.id} and userId: ${socket.data.userId} is joining rooms: ${rooms}`
    );
    socket.emit("joined_room");
    socket.join(rooms);
  };
}

function setCheckDroppedConnection(
  socket: Socket,
  drop: NodeJS.Timeout,
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
  setTimeout(() => isConnectionDropped(socket, drop, io), MAX_TIMEOUT);
}

function isConnectionDropped(
  socket: Socket,
  drop: NodeJS.Timeout,
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
  if (!socket) return; // if socket does not exist exit
  socket.emit("echo"); //emit an echo

  // check to see if user will respond
  drop = setTimeout(async () => {
    console.log("socket did not respond");
    await editUser({
      userId: socket.data.userId,
      updates: { status: "offline" },
    }); // set status to offline
    socket.rooms.forEach((room) => {
      io.to(room).emit("logged_user_out", {
        userId: socket.data.userId,
        payload: room,
      });
    }); // send status change to other users
  }, 5000);
}
