import { IGroup } from "@/server/Features/group/group";
import { IUser } from "@/server/Features/user/user";

export const GroupEventsNames = {
  DELETE_GROUP: {
    send: "delete_the_group",
    broadcast: "delete_group",
    error: "delete_group_error",
  },
};
export type DeleteEvent = {
  groupId: string;
};

export type InvalidateEvent = {
  queryTags: string[];
  groupId: string;
};

export type UpdateEvent = {
  groupId: string;
  group_updates: Partial<IGroup>;
};

export type JoinRoomEvent = {
  rooms: string[];
  userId: string;
};

export type UpdateGroupUsersEvent = {
  groupId: string;
  payload: { userInfo: IUser };
};

export type LeaveRoomEvent = {
  groupId: string;
  payload: { userId: string };
};

export type LeaveGroupEvent = {
  groupId: string;
  payload: { userId: string };
};
