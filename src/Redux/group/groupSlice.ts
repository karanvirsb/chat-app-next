import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IGroup } from "@/server/Features/group/group";
import { IGroupChannel } from "@/server/Features/groupChannel/groupChannel";
import { IGroupMessage } from "@/server/Features/groupMessage/groupMessage";

export interface IGroupState {
  groups: IGroup[];
  channels: IGroupChannel[];
}

const initialState: IGroupState = {
  groups: [],
  channels: [],
};

const groupSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    setGroups(state, action: PayloadAction<IGroup[]>) {
      state.groups = action.payload;
    },
    addGroup(state, action: PayloadAction<IGroup>) {
      state.groups.push(action.payload);
    },
    updateGroup(
      _state,
      _action: PayloadAction<{
        groupId: string;
        group_updates: Partial<Omit<IGroup, "groupId" | "dateCreated">>;
      }>
    ) {
      return;
    },
    deleteGroup(_state, _action: PayloadAction<{ groupId: string }>) {
      return;
    },
    setChannels(state, action: PayloadAction<IGroupChannel[]>) {
      state.channels = action.payload;
    },
    addChannel(
      _state,
      _action: PayloadAction<{
        channel: Pick<IGroupChannel, "groupId" | "channelName">;
      }>
    ) {
      return;
      // state.channels.push(action.payload.channel);
    },
    deleteChannel(
      _state,
      _action: PayloadAction<{ channelId: string; groupId: string }>
    ) {
      return;
    },
    createMessage(_state, _action: PayloadAction<{ message: IGroupMessage }>) {
      return;
    },
  },
});

export const groupActions = groupSlice.actions;
export const groupReducer = groupSlice.reducer;
