import { IGroup, IUser } from "../Hooks/groupHooks";

export type InvalidateEvent = {
  queryTags: string[];
  groupId: string;
};

export type UpdateEvent = {
  groupId: string;
  group_updates: Partial<IGroup>;
};

export type DeleteEvent = {
  groupId: string;
  payload: Record<>;
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
