"use client";
import React, { useEffect } from "react";
import useGetSession from "../../../Hooks/useGetSession";
import { useGetGroupsQuery } from "../../../Hooks/groupHooks";
import socket from "../../../Sockets";

import useLoginAndLogoutSockets from "../../../Sockets/Hooks/useLoginAndLogoutSockets";
import { isGroupArray } from "../../../../test/validation/schemaValidation";
import Link from "next/link";

type props = {
  activeIndex: number;
  setTabToGroup: (id: string, index: number) => void;
};

// TODO prefetch group data
export default function GroupList({ setTabToGroup, activeIndex }: props) {
  const { sessionInfo } = useGetSession();
  const {
    data: groups,
    isLoading,
    isSuccess,
    error,
  } = useGetGroupsQuery({ userId: sessionInfo?.userId });
  const send = useLoginAndLogoutSockets();
  useEffect(() => {
    // check if its done loading and is successful then add groups into array and add rooms;
    if (!isLoading && isSuccess && sessionInfo && isGroupArray(groups)) {
      const groupIds = [];

      for (const group of groups) {
        groupIds.push(group.groupId);
      }

      socket.emit("join_rooms", {
        rooms: groupIds,
        userId: sessionInfo.userId,
      });
      send({
        event: "login_user",
        data: { userId: sessionInfo?.userId, payload: { groupIds: groupIds } },
      });
    }
  }, [isLoading, isSuccess]);

  let content;
  // TODO fix loading with spinner
  if (isLoading) {
    content = <>Loading...</>;
  } else if (isSuccess) {
    if (groups === undefined) {
      content = <></>;
    } else if (isGroupArray(groups)) {
      content = groups.map((group, index) => {
        if (index === activeIndex) {
          return (
            <li key={group.groupId}>
              <Link
                href={`/group/${group.groupId}`}
                className="btn btn-circle bg-white text-black"
                onClick={() => {
                  setTabToGroup(group.groupId, index);
                }}
              >
                {
                  group.groupName[0] // TODO split and get first index
                }
              </Link>
            </li>
          );
        } else {
          return (
            <li key={group.groupId}>
              <Link
                href={`/group/${group.groupId}`}
                className="btn btn-circle"
                onClick={() => {
                  setTabToGroup(group.groupId, index);
                }}
              >
                {
                  group.groupName[0] // TODO split and get first index
                }
              </Link>
            </li>
          );
        }
      });
    }
  } else {
    content = <button className="btn btn-circle">!</button>;
    console.error(error, groups);
  }
  return <>{content}</>;
}
