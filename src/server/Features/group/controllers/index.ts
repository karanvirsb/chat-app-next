import groupService from "../use-cases";
import makeAddGroupController from "./add-group";
import makeAddUserToGroupController from "./add-userToGroup";
import makeDeleteGroupController from "./delete-group";
import makeDeleteUserFromGroupController from "./delete-userFromGroup";
import makeGetGroupByIdController from "./get-byGroupId";
import makeGetGroupByInviteCodeController from "./get-byGroupInviteCode";
import makeGetGroupsByUserIdController from "./get-groupsByUserId";
import makeGetUsersByGroupIdController from "./get-UsersByGroupId";
import makeUpdateGroupNameController from "./update-groupName";
import makeUpdateInviteCodeController from "./update-inviteCode";

const addGroupController = makeAddGroupController({
    addGroup: groupService.addGroup,
});
const deleteGroupController = makeDeleteGroupController({
    deleteGroup: groupService.deleteGroup,
});
const getGroupByIdController = makeGetGroupByIdController({
    getGroupById: groupService.getGroupById,
});

const getGroupByInviteCodeController = makeGetGroupByInviteCodeController({
    getGroupByInviteCode: groupService.getGroupByInviteCode,
});

const getUsersByGroupIdController = makeGetUsersByGroupIdController({
    getUsersByGroupId: groupService.getUsersByGroupId,
});

const getGroupsByUserIdController = makeGetGroupsByUserIdController({
    getGroupsByUserId: groupService.getGroupsByUserId,
});

const updateGroupNameController = makeUpdateGroupNameController({
    updateGroupName: groupService.updateGroupName,
});

const updateInviteCodeController = makeUpdateInviteCodeController({
    updateInviteCode: groupService.updateInviteCode,
});

const addUserToGroupController = makeAddUserToGroupController({
    addUserToGroup: groupService.addUserToGroup,
});

const deleteUserFromGroupController = makeDeleteUserFromGroupController({
    removeUserFromGroup: groupService.removeUserFromGroup,
});

const groupControllers = Object.freeze({
    addGroupController,
    deleteGroupController,
    getGroupByIdController,
    getGroupByInviteCodeController,
    getUsersByGroupIdController,
    updateGroupNameController,
    updateInviteCodeController,
    addUserToGroupController,
    deleteUserFromGroupController,
    getGroupsByUserIdController,
});

export default groupControllers;

export {
    addGroupController,
    deleteGroupController,
    getGroupByIdController,
    getGroupByInviteCodeController,
    getUsersByGroupIdController,
    updateGroupNameController,
    updateInviteCodeController,
    addUserToGroupController,
    deleteUserFromGroupController,
    getGroupsByUserIdController,
};
