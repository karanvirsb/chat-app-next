import { IGroupChannel } from "../../Hooks/groupChannelHooks";

export type UpdateChannelsListEvent = {
  groupId: string;
  payload: { channelInfo: IGroupChannel };
};
