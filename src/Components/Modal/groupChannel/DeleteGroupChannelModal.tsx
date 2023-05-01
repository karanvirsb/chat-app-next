import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

import { useAppDispatch } from "@/Hooks/reduxHooks";
import { useSocketLoading } from "@/Hooks/useSocketLoading";
import { groupActions } from "@/Redux/group/groupSlice";
import { resetModal } from "@/Redux/slices/modalSlice";
import { TGroupChannelEvents } from "@/shared/socket-events/groupChannelTypes";

import MutationModal from "../MutationModal";

type props = {
  channelId: string;
  groupId: string;
};

export function DeleteGroupChannelModal({ channelId, groupId }: props) {
  const router = useRouter();
  const useParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { loading, error, setLoading } = useSocketLoading({
    socketEvent: TGroupChannelEvents.DELETE_CHANNEL.broadcast,
    errorEvent: TGroupChannelEvents.DELETE_CHANNEL.error,
    successCB: () => {
      handleCancel();
      router.replace(`/group/${useParams.get("groupId") as string}`);
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
      modalName="Delete Channel"
      text="Are you sure you want to delete the channel?"
      loading={loading}
      handleCancel={handleCancel}
      handleSubmit={() => {
        setLoading(true);
        handleSubmit();
      }}
    ></MutationModal>
  );

  function handleSubmit() {
    dispatch(groupActions.deleteChannel({ channelId, groupId }));
  }

  function handleCancel() {
    dispatch(resetModal());
  }
}
