import { AxiosError } from "axios";
import React, { useEffect, useState } from "react";

import { groupActions } from "@/Redux/group/groupSlice";

import {
  returnGroupData,
  useUpdateGroupNameMutation,
} from "../../Hooks/groupHooks";
import { useAppDispatch } from "../../Hooks/reduxHooks";
import { resetModal } from "../../Redux/slices/modalSlice";
import BtnCallToAction from "../Buttons/BtnCallToAction";
import BtnCancelAction from "../Buttons/BtnCancelAction";
import ModalInput from "../Inputs/ModalInput";
import Modal from "./Modal";

type props = {
  groupId: string;
  previousName: string;
};

// TODO give group id
export default function ChangeGroupNameModal({ groupId, previousName }: props) {
  const [newGroupName, setnewGroupName] = useState<string>("");
  const [errMsg, setErrMsg] = useState("");
  const { mutate, isLoading, isSuccess, isError, error } =
    useUpdateGroupNameMutation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isLoading && isSuccess) {
      closeModal();
      setnewGroupName("");
      setErrMsg("");
    }
    if (!isLoading && isError) {
      if (error instanceof AxiosError) {
        const errorMessage: returnGroupData = error.response?.data;
        setErrMsg(errorMessage.error);
      }
    }
  }, [isLoading, isSuccess]);

  return (
    <Modal modalName="Change Group Name">
      <div className="flex flex-col gap-4 mt-6">
        <ModalInput
          labelName="Previous Name"
          editable={false}
          value={previousName}
          inputId="prevName"
        ></ModalInput>
        <ModalInput
          labelName="New Name"
          onChange={handleChange}
          value={newGroupName}
          placeholder="Enter New Group Name Here"
          inputId="newGroupName"
          errorMsg={errMsg}
        ></ModalInput>
        <div className="flex gap-4 mt-2">
          <BtnCallToAction
            text="Change"
            onClick={handleSubmit}
            isLoading={isLoading}
          ></BtnCallToAction>
          <BtnCancelAction text="Cancel" onClick={closeModal}></BtnCancelAction>
        </div>
      </div>
    </Modal>
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setnewGroupName(() => e.target.value);

    if (e.target.value.length > 0) {
      setErrMsg("");
    } else {
      setErrMsg("Group name must be provided.");
    }
  }

  function closeModal() {
    dispatch(resetModal());
  }

  // api slice
  function handleSubmit() {
    if (!newGroupName) setErrMsg("Group name must be provided.");

    if (!isLoading) {
      try {
        dispatch(
          groupActions.updateGroup({
            groupId,
            group_updates: { groupName: newGroupName },
          })
        );
        // mutate({ groupId, newGroupName });
      } catch (error) {
        console.log(error);
      }
    }
  }
}
