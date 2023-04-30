import React, { useEffect, useState } from "react";

import { useSocketLoading } from "@/Hooks/useSocketLoading";
import { groupActions } from "@/Redux/group/groupSlice";
import { IGroupChannel } from "@/server/Features/groupChannel/groupChannel";
import { TGroupChannelEvents } from "@/shared/socket-events/groupChannelTypes";
import { isZodError } from "@/utilities/isZodError";
import { isZodIssues } from "@/utilities/isZodIssues";

import { useAppDispatch } from "../../Hooks/reduxHooks";
import { resetModal } from "../../Redux/slices/modalSlice";
import BtnCallToAction from "../Buttons/BtnCallToAction";
import BtnCancelAction from "../Buttons/BtnCancelAction";
import ModalInput from "../Inputs/ModalInput";
import Modal from "./Modal";

type props = {
  groupId: string;
};
export default function CreateGroupChannelModal({ groupId }: props) {
  const [channelName, setChannelName] = useState("");
  const [errorMsg, setErrorMessage] = useState("");

  const { loading, setLoading, error } = useSocketLoading({
    errorEvent: TGroupChannelEvents.ADD_CHANNEL.error,
    socketEvent: TGroupChannelEvents.ADD_CHANNEL.broadcast,
    successCB: () => {
      setChannelName("");
      setErrorMessage("");
      closeModal();
    },
  });
  const dispatch = useAppDispatch();

  // const { mutate, isLoading, isSuccess, isError, error } =
  //   useCreateGroupChannelMutation();

  useEffect(() => {
    if (error) {
      if (isZodError<IGroupChannel>(error)) {
        setErrorMessage(
          error.flatten().fieldErrors.channelName?.join("and") ??
            "An Error Occurred. Try Again!"
        );
      }
      if (isZodIssues(error)) {
        setErrorMessage(
          error.issues
            .map((issue) => {
              return issue.message;
            })
            .join("and")
        );
      }

      if (typeof error === "string") {
        setErrorMessage(error);
      }
    }
  }, [error]);

  return (
    <Modal modalName="Create Channel" modalClass="flex">
      <div className="flex flex-col flex-grow w-full gap-4 mt-6 justify-end">
        <ModalInput
          labelName="Channel Name"
          onChange={handleChange}
          value={channelName}
          placeholder="Channel Name"
          inputId="channelName"
          formClass="flex-grow"
          errorMsg={errorMsg}
        ></ModalInput>
        <div className="flex gap-4 mt-2">
          <BtnCallToAction
            text="Create"
            onClick={() => {
              handleSubmit();
              setLoading(true);
            }}
            isLoading={loading}
          ></BtnCallToAction>
          <BtnCancelAction text="Cancel" onClick={closeModal}></BtnCancelAction>
        </div>
      </div>
    </Modal>
  );

  function closeModal() {
    dispatch(resetModal());
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setChannelName(() => e.target.value);
    if (e.target.value.length > 0) {
      setErrorMessage("");
    }
  }

  function handleSubmit() {
    if (!channelName) setErrorMessage("Group name must be provided.");
    if (!loading) {
      try {
        // mutate({
        //   channelName,
        //   groupId,
        // });
        dispatch(
          groupActions.addChannel({
            channel: { channelName, groupId },
          })
        );
      } catch (err) {
        console.log(err);
      }
    }
  }
}
