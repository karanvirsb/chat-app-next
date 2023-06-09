import { moderateName } from "../../../Utilities/moderateText";
import channelDb from "../data-access";
import makeCreateChannel from "./createChannel";
import { handleModerationType } from "./createChannel";
import makeDeleteChannel from "./deleteChannel";
import makeGetChannelById from "./getChannelById";
import makeGetChannelsByGroupId from "./getChannelsByGroupId";
import makeUpdateChannelName from "./updateChannelName";
const handleModeration: handleModerationType = async (channelName: string) => {
  return await moderateName(channelName);
};

const createChannel = makeCreateChannel({ handleModeration, channelDb });
const deleteChannel = makeDeleteChannel({ channelDb });
const updateChannelName = makeUpdateChannelName({
  handleModeration,
  channelDb,
});
const getChannelById = makeGetChannelById({ channelDb });
const getChannelsByGroupId = makeGetChannelsByGroupId({ channelDb });

const channelService = Object.freeze({
  createChannel,
  deleteChannel,
  updateChannelName,
  getChannelById,
  getChannelsByGroupId,
});

export default channelService;

export {
  createChannel,
  deleteChannel,
  updateChannelName,
  getChannelById,
  getChannelsByGroupId,
};
