import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
// import axios from "../API/axios";
import axios from "axios";

import { IGroupMessage } from "@/server/Features/groupMessage/groupMessage";

import useGroupChatSockets from "../Sockets/Hooks/useGroupChatSockets";
import { PaginatedGroupMessages } from "../utilities/types/pagination";

type ReturnGroupMessages = {
  success: boolean;
  data: PaginatedGroupMessages<IGroupMessage> | undefined;
  error: string;
};

type ReturnGroupMessage = {
  success: boolean;
  data: IGroupMessage | undefined;
  error: string;
};

// setting up global variables
const baseurl = "http://localhost:3000/api/groupMessage";

type IUserGetGroupMessagesByChannelIdQuery = UseInfiniteQueryResult<
  PaginatedGroupMessages<IGroupMessage> | undefined,
  unknown
>;

function useGetGroupMessagesByChannelIdQuery({
  channelId,
  dateCreated,
  limit,
}: {
  channelId: string;
  dateCreated: number;
  limit: number;
}): IUserGetGroupMessagesByChannelIdQuery {
  const getMessages = async ({
    pageParam = `${baseurl}/channel/messages?channelId=${channelId}&limit=${limit}&dateCreated=${dateCreated}`,
  }): Promise<PaginatedGroupMessages<IGroupMessage> | undefined> => {
    if (pageParam === null || pageParam.length === 0) return undefined;
    const resp = await axios({
      url: pageParam,
      method: "GET",
    });

    const data: ReturnGroupMessages = resp.data.body;
    return data.data;
  };

  return useInfiniteQuery({
    queryKey: [`group-messages-${channelId}`],
    queryFn: getMessages,
    enabled: channelId.length > 0 && dateCreated !== null,
    getNextPageParam: (last, page) => last?.nextPage,
  });
}

// MUTATIONS
type IUseCreateGroupMessageMutation = UseMutationResult<
  ReturnGroupMessage,
  unknown,
  {
    channelId: string;
    dateCreated: Date;
    text: string;
    userId: string;
  },
  unknown
>;
function useCreateGroupMessageMutation({
  groupId,
}: {
  groupId: string;
}): IUseCreateGroupMessageMutation {
  const send = useGroupChatSockets();
  const createMessage = async ({
    channelId,
    dateCreated,
    text,
    userId,
  }: {
    channelId: string;
    dateCreated: Date;
    text: string;
    userId: string;
  }): Promise<ReturnGroupMessage> => {
    const resp = await axios({
      url: `${baseurl}`,
      method: "POST",
      data: { messageInfo: { channelId, dateCreated, userId, text } },
    });

    const data: ReturnGroupMessage = resp.data.body;
    return data;
  };

  return useMutation({
    mutationFn: createMessage,
    onSuccess: async (data) => {
      if (data.data === undefined) return;

      send({
        event: "create_group_message",
        data: {
          groupId,
          payload: { messageInfo: data.data },
        },
      });
    },
  });
}

type IUseEditMessageTextMutation = UseMutationResult<
  ReturnGroupMessage,
  unknown,
  {
    messageId: string;
    updateValue: string;
    pageIndex: number;
    messageIndex: number;
  },
  unknown
>;
function useEditMessageTextMutation({
  groupId,
}: {
  groupId: string;
}): IUseEditMessageTextMutation {
  const send = useGroupChatSockets();

  const updateMessage = async ({
    messageId,
    updateValue,
    pageIndex,
    messageIndex,
  }: {
    messageId: string;
    updateValue: string;
    pageIndex: number;
    messageIndex: number;
  }): Promise<ReturnGroupMessage> => {
    const resp = await axios({
      url: `${baseurl}`,
      data: { messageId, updates: { text: updateValue } },
      method: "PUT",
    });
    const data: ReturnGroupMessage = resp.data.body;
    return data;
  };

  return useMutation({
    mutationFn: updateMessage,
    onSuccess: async (data, variables) => {
      if (data.data === undefined) return;

      send({
        event: "update_group_message",
        data: {
          groupId,
          payload: {
            messageInfo: data.data,
            messageIndex: variables.messageIndex,
            pageIndex: variables.pageIndex,
          },
        },
      });
    },
  });
}

type IUseDeleteGroupMessageMutation = UseMutationResult<
  ReturnGroupMessage,
  unknown,
  {
    messageId: string;
    pageIndex: number;
    messageIndex: number;
  },
  unknown
>;

function useDeleteGroupMessageMutation({
  groupId,
}: {
  groupId: string;
}): IUseDeleteGroupMessageMutation {
  const send = useGroupChatSockets();
  const deleteMessage = async ({
    messageId,
    pageIndex,
    messageIndex,
  }: {
    messageId: string;
    pageIndex: number;
    messageIndex: number;
  }): Promise<ReturnGroupMessage> => {
    const resp = await axios({
      url: baseurl,
      method: "DELETE",
      data: { messageId },
    });

    const data: ReturnGroupMessage = resp.data.body;
    return data;
  };

  return useMutation({
    mutationFn: deleteMessage,
    onSuccess: async (data, variables) => {
      if (data.data === undefined) return;

      send({
        event: "delete_group_message",
        data: {
          groupId,
          payload: {
            messageId: data.data.messageId,
            channelId: data.data.channelId,
            pageIndex: variables.pageIndex,
            messageIndex: variables.messageIndex,
          },
        },
      });
    },
  });
}

export {
  useGetGroupMessagesByChannelIdQuery,
  useCreateGroupMessageMutation,
  useEditMessageTextMutation,
  useDeleteGroupMessageMutation,
};
