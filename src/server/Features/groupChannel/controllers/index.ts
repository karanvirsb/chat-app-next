import channelService from "../use-cases";
import makeCreateChannelController from "./create-channel";
import makeDeleteChannelController from "./delete-channel";
import makeGetChannelByIdController from "./get-channelbyId";
import makeGetChannelsByGroupIdController from "./get-channelsByGroupId";
import makeUpdateChannelNameController from "./update-groupName";

const createChannelController = makeCreateChannelController({
    createChannel: channelService.createChannel,
});
const deleteChannelController = makeDeleteChannelController({
    deleteChannel: channelService.deleteChannel,
});
const getChannelByIdController = makeGetChannelByIdController({
    getChannelById: channelService.getChannelById,
});
const getChannelsByGroupIdController = makeGetChannelsByGroupIdController({
    getChannelsByGroupId: channelService.getChannelsByGroupId,
});
const updateChannelNameController = makeUpdateChannelNameController({
    updateChannelName: channelService.updateChannelName,
});

const channelControllers = Object.freeze({
    createChannelController,
    deleteChannelController,
    getChannelByIdController,
    getChannelsByGroupIdController,
    updateChannelNameController,
});

export default channelControllers;

export {
    createChannelController,
    deleteChannelController,
    getChannelByIdController,
    getChannelsByGroupIdController,
    updateChannelNameController,
};
