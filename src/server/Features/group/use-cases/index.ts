import sanitizeHtml from "sanitize-html";
import { moderateName } from "../../../Utilities/moderateText";
import inviteCodeGenerator from "../../../Utilities/inviteCodeGenerator";
import { IInviteCodeGenerator } from "../../../Utilities/inviteCodeGenerator";
import groupDb from "../data-access";
import makeAddGroup from "./addGroup";
import makeDeleteGroup from "./deleteGroup";
import makeGetGroupById from "./getGroupbyId";
import makeGetGroupByInviteCode from "./getGroupByInviteCode";
import makeGetUsersByGroupId from "./getUsersByGroupId";
import makeUpdateGroupName from "./updateGroupName";
import makeUpdateInviteCode from "./updateInviteCode";
import makeAddUserToGroup from "./addUserToGroup";
import makeRemoveUserFromGroup from "./removeUserFromGroup";
import makeGetGroupsByUserId from "./getGroupsByUserId";

export type handleModerationType = (name: string) => Promise<number | boolean>;
export type inviteCodeGeneratorType = IInviteCodeGenerator;

const handleModeration = async (name: string) => {
    return await moderateName(name);
};

function sanitizeText(text: string) {
    return sanitizeHtml(text);
}
const addGroup = makeAddGroup({ groupDb, handleModeration });
const getGroupById = makeGetGroupById({ groupDb });
const getGroupByInviteCode = makeGetGroupByInviteCode({ groupDb });
const getUsersByGroupId = makeGetUsersByGroupId({ groupDb });
const getGroupsByUserId = makeGetGroupsByUserId({ groupDb });
const updateGroupName = makeUpdateGroupName({
    groupDb,
    handleModeration,
    sanitizeName: sanitizeText,
});
const updateInviteCode = makeUpdateInviteCode({ groupDb, inviteCodeGenerator });
const deleteGroup = makeDeleteGroup({ groupDb });
const addUserToGroup = makeAddUserToGroup({ groupDb });
const removeUserFromGroup = makeRemoveUserFromGroup({ groupDb });

const groupService = Object.freeze({
    addGroup,
    getGroupById,
    getGroupByInviteCode,
    getUsersByGroupId,
    updateGroupName,
    deleteGroup,
    updateInviteCode,
    addUserToGroup,
    removeUserFromGroup,
    getGroupsByUserId,
});

export default groupService;

export {
    addGroup,
    getGroupById,
    getGroupByInviteCode,
    getUsersByGroupId,
    updateGroupName,
    deleteGroup,
    updateInviteCode,
    addUserToGroup,
    removeUserFromGroup,
    getGroupsByUserId,
};
