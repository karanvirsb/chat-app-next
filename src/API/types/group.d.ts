import { IGroup } from "../src/Features/group/group";
import { IUser } from "../src/Features/user/user";

export type InvalidateEvent = {
  queryTags: string[];
  groupId: string;
};

export type UpdateEvent = {
  groupId: string;
  payload: Partial<IGroup>;
};

export type DeleteEvent = {
  groupId: string;
  payload: {};
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
