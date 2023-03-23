import { Server, ServerOptions, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

import {
  LeaveRoomEvent,
  UpdateEvent,
  DeleteEvent,
  UpdateGroupUsersEvent,
  LeaveGroupEvent,
} from "./types/group";

import { UpdateChannelsListEvent } from "./types/groupChannel";
import {
  ICreateGroupMessageEvent,
  IDeleteGroupMessageEvent,
  IUpdateGroupMessageEvent,
} from "./types/groupChat";
import { ILogoutEvent } from "./types/user";
import { editUser } from "../src/Features/user/use-cases";
import { disconnect } from "process";

type props = {
  httpServer: Partial<ServerOptions> | undefined | any;
};

type socket = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

const chatRooms = new Map<string, Set<string>>();

const MAX_TIMEOUT = 240000; // 3 mins

export default function buildSockets({ httpServer }: props) {
  return function socketIo() {
    const io = new Server(httpServer, {
      cors: {
        origin: "http://localhost:3000",
        preflightContinue: false,
        credentials: true,
        methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
        optionsSuccessStatus: 204,
      },
    });

    let droppedConnectionTimeout: NodeJS.Timeout;
    io.on("connection", (socket) => {
      console.log("Socket is connected", socket.id);
      // socket.on("disconnect", () => {
      //   console.log("socket disconnected: ", socket.id, socket.disconnected);
      // });

      socket.on("ping", () => {
        clearTimeout(droppedConnectionTimeout);
        setCheckDroppedConnection(socket, droppedConnectionTimeout, io);
      });

      // USER EVENTS
      // makes the socket join all the rooms
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
          console.log(`userId: ${data.userId}, groupId: ${groupId}`);
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

      // GROUP EVENTS
      // when the update is successful
      socket.on("updated_group_name", (data: UpdateEvent) => {
        io.to(data.groupId).emit("update_group_name", data);
      });

      socket.on("delete_the_group", (groupData: DeleteEvent) => {
        io.to(groupData.groupId).emit("delete_group", groupData);
      });

      socket.on(
        "update_the_group_users",
        (groupUserData: UpdateGroupUsersEvent) => {
          io.to(groupUserData.groupId).emit(
            "update_group_users",
            groupUserData
          );
        }
      );

      socket.on("leave_the_group", (groupUserData: LeaveGroupEvent) => {
        io.to(groupUserData.groupId).emit("removed_user", groupUserData);
      });

      // group channel events
      socket.on("update_channel_lists", (data: UpdateChannelsListEvent) => {
        io.to(data.groupId).emit(
          "update_channel_list",
          data.payload.channelInfo
        );
      });

      // group chat events
      socket.on("create_group_message", (data: ICreateGroupMessageEvent) => {
        io.to(data.groupId).emit("new_group_chat_message", data);
      });

      socket.on("update_group_message", (data: IUpdateGroupMessageEvent) => {
        io.to(data.groupId).emit("update_group_chat_message", data);
      });

      socket.on("delete_group_message", (data: IDeleteGroupMessageEvent) => {
        io.to(data.groupId).emit("delete_group_chat_message", data);
      });
    });

    return io;
  };
}
function joinRooms(
  socket: socket,
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

function isConnectionDropped(
  socket: socket,
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

function setCheckDroppedConnection(
  socket: socket,
  drop: NodeJS.Timeout,
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
  setTimeout(() => isConnectionDropped(socket, drop, io), MAX_TIMEOUT);
}
