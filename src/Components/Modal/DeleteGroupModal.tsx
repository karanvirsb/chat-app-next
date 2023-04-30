import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

import { useSocketLoading } from "@/Hooks/useSocketLoading";
import { groupActions } from "@/Redux/group/groupSlice";
import { GroupEventsNames } from "@/shared/socket-events/groupEventTypes";

import { useAppDispatch } from "../../Hooks/reduxHooks";
import { resetModal } from "../../Redux/slices/modalSlice";
import MutationModal from "./MutationModal";

type props = {
  groupId: string;
};

export default function DeleteGroupModal({ groupId }: props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error, setLoading } = useSocketLoading({
    socketEvent: GroupEventsNames.DELETE_GROUP.broadcast,
    errorEvent: GroupEventsNames.DELETE_GROUP.error,
    successCB: () => {
      handleCancel();
      router.replace("/me");
    },
  });

  useEffect(() => {
    if (error) {
      //TODO HANDLE ERROR
    }
  }, [error]);

  return (
    <MutationModal
      btnCTAName="Yes"
      btnCancelName="No"
      modalName="Delete Group"
      text="Are you sure you want to delete the group?"
      loading={loading}
      handleCancel={handleCancel}
      handleSubmit={() => {
        setLoading(true);
        handleSubmit();
      }}
    ></MutationModal>
  );

  function handleSubmit() {
    // deleteGroup({ groupId });
    dispatch(groupActions.deleteGroup({ groupId }));
  }

  function handleCancel() {
    dispatch(resetModal());
  }
}
