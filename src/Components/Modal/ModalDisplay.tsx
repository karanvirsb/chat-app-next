import React from "react";

import { useAppSelector } from "../../Hooks/reduxHooks";
import { ModalState } from "../../Redux/slices/modalSlice";
import AddFriendModal from "./AddFriendModal";
import ChangeGroupNameModal from "./ChangeGroupNameModal";
import CreateGroupChannelModal from "./CreateGroupChannelModal";
import CreateGroupModal from "./CreateGroupModal";
import DeleteAccountModal from "./DeleteAccountModal";
import DeleteMessageModal from "./DeleteGroupMessageModal";
import DeleteGroupModal from "./DeleteGroupModal";
import EditEmailModal from "./EditEmailModal";
import EditPasswordModal from "./EditPasswordModal";
import EditUsernameModal from "./EditUsernameModal";
import InviteUserModal from "./InviteUserModal";
import JoinGroupModal from "./JoinGroupModal";
import LeaveGroupModal from "./LeaveGroupModal";

export default function ModalDisplay() {
  const modalState: ModalState = useAppSelector((state) => state.modalReducer);

  return (
    <>
      {modalState.open && modalState.modalName === "changeGroupName" && (
        <ChangeGroupNameModal
          groupId={modalState.options.groupId}
          previousName={modalState.options.previousName}
        ></ChangeGroupNameModal>
      )}

      {modalState.open && modalState.modalName === "inviteUser" && (
        <InviteUserModal
          inviteCode={modalState.options.inviteCode}
        ></InviteUserModal>
      )}

      {modalState.open && modalState.modalName === "deleteGroup" && (
        <DeleteGroupModal
          groupId={modalState.options.groupId}
        ></DeleteGroupModal>
      )}

      {modalState.open && modalState.modalName === "leaveGroup" && (
        <LeaveGroupModal groupId={modalState.options.groupId}></LeaveGroupModal>
      )}

      {modalState.open && modalState.modalName === "createGroup" && (
        <CreateGroupModal></CreateGroupModal>
      )}

      {modalState.open && modalState.modalName === "addFriend" && (
        <AddFriendModal></AddFriendModal>
      )}

      {modalState.open && modalState.modalName === "deleteAccount" && (
        <DeleteAccountModal></DeleteAccountModal>
      )}

      {modalState.open && modalState.modalName === "editUsername" && (
        <EditUsernameModal></EditUsernameModal>
      )}

      {modalState.open && modalState.modalName === "editEmail" && (
        <EditEmailModal></EditEmailModal>
      )}

      {modalState.open && modalState.modalName === "editPassword" && (
        <EditPasswordModal></EditPasswordModal>
      )}

      {modalState.open && modalState.modalName === "joinGroup" && (
        <JoinGroupModal
          inviteCode={modalState.options.inviteCode}
        ></JoinGroupModal>
      )}

      {modalState.open && modalState.modalName === "createGroupChannel" && (
        <CreateGroupChannelModal
          groupId={modalState.options.groupId}
        ></CreateGroupChannelModal>
      )}

      {modalState.open && modalState.modalName === "deleteGroupMessage" && (
        <DeleteMessageModal
          messageId={modalState.options.messageId}
          groupId={modalState.options.groupId}
          messageIndex={modalState.options.messageIndex}
          pageIndex={modalState.options.pageIndex}
        ></DeleteMessageModal>
      )}
    </>
  );
}
