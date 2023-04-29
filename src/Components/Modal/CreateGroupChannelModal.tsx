import React, { useEffect, useState } from "react";

import { groupActions } from "@/Redux/group/groupSlice";
import { IGroupChannel } from "@/server/Features/groupChannel/groupChannel";
import socket from "@/Sockets";
import { isZodError } from "@/utilities/isZodError";

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
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const dispatch = useAppDispatch();

  // const { mutate, isLoading, isSuccess, isError, error } =
  //   useCreateGroupChannelMutation();

  useEffect(() => {
    if (!isLoading && isSuccess) {
      closeModal();
      setChannelName("");
      setErrorMessage("");
    }
    socket.on("add_new_channel_error", (data: unknown) => {
      if (isZodError<IGroupChannel>(data)) {
        setErrorMessage(
          data.flatten().fieldErrors.channelName?.join("and") ??
            "An Error Occurred. Try Again!"
        );
      }
    });

    return () => {
      socket.off("add_new_channel_error");
    };
  }, [isLoading, isSuccess]);

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
            onClick={handleSubmit}
            isLoading={isLoading}
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
    if (!isLoading) {
      try {
        // mutate({
        //   channelName,
        //   groupId,
        // });

        dispatch(
          groupActions.addChannel({
            channel: { channelName, groupId },
            setLoading: setIsLoading,
            setSuccess: setIsSuccess,
          })
        );
      } catch (err) {
        console.log(err);
      }
    }
  }
}
