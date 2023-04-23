import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import useFilterGroups from "@/Hooks/useFilterGroups";

import { isGroup } from "../../../../test/validation/schemaValidation";
import Collapse from "../../../Components/Collapse/Collapse";
import DropDown from "../../../Components/DropDown/DropDown";
import SidebarInfo from "../../../Components/SidebarInfo/SidebarInfo";
import { useGetGroupChannelsQuery } from "../../../Hooks/groupChannelHooks";
import { IGroup } from "../../../Hooks/groupHooks";
import { useAppDispatch } from "../../../Hooks/reduxHooks";
import { setModal } from "../../../Redux/slices/modalSlice";

type props = {
  groupId: string;
};

// TODO create channel components and set selected channel id
export default function GroupSidebarInfo({ groupId }: props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeChannel, setActiveChannel] = useState("");
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  // TODO use cached data

  const data: IGroup[] | string | undefined = queryClient.getQueryData([
    "groups",
  ]);
  // filtering out groups to only get one
  const group = useFilterGroups({ groups: data, groupId });

  const { data: channels, isLoading: isChannelsLoading } =
    useGetGroupChannelsQuery({ groupId: group.groupId });

  useEffect(() => {
    if (activeChannel.length > 0) {
      router.push(`/group/${groupId}?channel=${activeChannel}`);
    }
  }, [activeChannel]);

  return (
    <SidebarInfo>
      <>
        <DropDown
          btnChildren={getGroupName()}
          btnClass="btn font-bold h-16 rounded-none w-full"
          dropDownClass="flex flex-col items-center"
          listClass="relative top-[125%] w-[90%]"
          symbol={true}
        >
          <>
            <li>
              <button
                className="btn bg-btn-primary border-none font-bold mb-2 text-btn-mutations-text hover:bg-btn-primary-hover"
                onClick={displayChangeGroupNameModal}
              >
                Change Group Name
              </button>
            </li>
            <li>
              <button
                className="btn bg-btn-primary border-none font-bold mb-2 text-btn-mutations-text hover:bg-btn-primary-hover"
                onClick={displayInviteUserModal}
              >
                Invite User
              </button>
            </li>
            <li>
              <button
                className="btn bg-btn-mutations border-none font-bold mb-2 text-btn-mutations-text hover:bg-btn-mutations-hover"
                onClick={displayDeleteGroupModal}
              >
                Delete Group
              </button>
            </li>
            <li>
              <button
                className="btn bg-btn-mutations border-none font-bold mb-2 text-btn-mutations-text hover:bg-btn-mutations-hover"
                onClick={displayLeaveGroupModal}
              >
                Leave Group
              </button>
            </li>
          </>
        </DropDown>
        {/* <div className='bg-groupInfo-bg border-b border-chat-bg flex items-center font-semibold drop-shadow-md py-2 px-4 w-full h-16 text-white'>
                    Group Name
                </div> */}
        <div className="bg-groupInfo-bg flex-grow text-white">
          <Collapse
            title="Text Channels"
            clickEvent={displayCreateChannelModal}
          >
            <ul className="flex flex-col mt-4 gap-1 justify-center w-full capitalize">
              {channels?.map((channel) => {
                if (channel.channelId === searchParams.get("channel")) {
                  return (
                    <li className="opacity-80" key={channel.channelId}>
                      <span className="mr-2">#</span>
                      {channel.channelName}
                    </li>
                  );
                } else {
                  return (
                    <li
                      key={channel.channelId}
                      onClick={() => {
                        setActiveChannel(channel.channelId);
                      }}
                      className="cursor-pointer opacity-80"
                    >
                      {channel.channelName}
                    </li>
                  );
                }
              })}
            </ul>
          </Collapse>
        </div>
      </>
    </SidebarInfo>
  );

  function getGroupName() {
    return group?.groupName;
  }

  // TODO added pass through values
  function displayChangeGroupNameModal() {
    if (isGroup(group))
      dispatch(
        setModal({
          modalName: "changeGroupName",
          open: true,
          options: {
            groupId: group.groupId,
            previousName: group.groupName,
          },
        })
      );
  }

  function displayInviteUserModal() {
    if (isGroup(group))
      dispatch(
        setModal({
          modalName: "inviteUser",
          open: true,
          options: {
            inviteCode: group.inviteCode,
          },
        })
      );
  }

  function displayDeleteGroupModal() {
    if (isGroup(group))
      dispatch(
        setModal({
          modalName: "deleteGroup",
          open: true,
          options: { groupId: group.groupId },
        })
      );
  }

  function displayLeaveGroupModal() {
    dispatch(
      setModal({
        modalName: "leaveGroup",
        open: true,
        options: { groupId },
      })
    );
  }

  function displayCreateChannelModal() {
    dispatch(
      setModal({
        modalName: "createGroupChannel",
        open: true,
        options: { groupId },
      })
    );
  }
}
