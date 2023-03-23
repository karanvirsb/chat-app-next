import { IGroupChannel } from "../../src/Features/groupChannel/groupChannel";

export type UpdateChannelsListEvent = {
  groupId: string;
  payload: { channelInfo: IGroupChannel };
};
