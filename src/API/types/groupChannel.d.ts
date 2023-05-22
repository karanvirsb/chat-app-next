import { IGroupChannel } from "@/server/Features/groupChannel/groupChannel";

export type UpdateChannelsListEvent = {
  groupId: string;
  payload: { channelInfo: IGroupChannel };
};
