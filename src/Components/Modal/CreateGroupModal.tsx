import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../../Hooks/reduxHooks";
// import useGetSession from "../../Hooks/useGetSession";
import {
  returnGroupData,
  useCreateGroupMutation,
} from "../../Hooks/groupHooks";
import { resetModal } from "../../Redux/slices/modalSlice";
import BtnCallToAction from "../Buttons/BtnCallToAction";
import BtnCancelAction from "../Buttons/BtnCancelAction";
import ModalInput from "../Inputs/ModalInput";
import Modal from "./Modal";
import { AxiosError } from "axios";
import { useSession } from "next-auth/react";

// TODO
export default function CreateGroupModal() {
  const [groupName, setGroupName] = useState("");
  const [errorMsg, setErrorMessage] = useState("");
  const dispatch = useAppDispatch();
  const { data: sessionInfo } = useSession();
  const { mutate, isLoading, isSuccess, isError, error } =
    useCreateGroupMutation();

  useEffect(() => {
    if (!isLoading && isSuccess) {
      closeModal();
      setGroupName("");
      setErrorMessage("");
    }
    if (!isLoading && isError) {
      if (error instanceof AxiosError) {
        const errorMessage: returnGroupData = error.response?.data;
        setErrorMessage(errorMessage.error);
      }
    }
  }, [isLoading, isSuccess, isError, error]);

  return (
    <Modal modalName="Add Group" modalClass="flex">
      <div className="flex flex-col flex-grow w-full gap-4 mt-6 justify-end">
        <ModalInput
          labelName="Group Name"
          onChange={handleChange}
          value={groupName}
          placeholder="Group Name"
          inputId="groupName"
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
    setGroupName(() => e.target.value);
    if (e.target.value.length > 0) {
      setErrorMessage("");
    }
  }

  function handleSubmit() {
    if (!groupName) setErrorMessage("Group name must be provided.");
    if (!isLoading) {
      try {
        mutate({
          groupInfo: { groupName },
          userId: sessionInfo != null ? sessionInfo.user?.id : "",
        });
      } catch (err) {
        console.log(err);
      }
    }
  }
}
