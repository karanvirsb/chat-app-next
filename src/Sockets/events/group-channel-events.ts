import { QueryClient } from "@tanstack/react-query";
import { Socket } from "socket.io-client";

import { IGroupChannel } from "@/server/Features/groupChannel/groupChannel";
import { TGroupChannelEvents } from "@/shared/socket-events/groupChannelTypes";

type props = { socket: Socket; queryClient: QueryClient };
export function groupChannelEvents({ socket, queryClient }: props) {
  socket.on(
    TGroupChannelEvents.ADD_CHANNEL.broadcast,
    (data: UseCaseReturn<IGroupChannel>) => {
      if (data.success) {
        queryClient.setQueriesData(
          [`group-channels-${data?.data?.groupId}`],
          (oldData: unknown) => {
            // get the old data and push new result
            // need to assign it a new reference so it refreshes
            const pushNewChannel = (arr: IGroupChannel[]) => {
              return [...arr, data?.data];
            };
            // if the oldData is an array then add the push new channel
            return Array.isArray(oldData) ? pushNewChannel(oldData) : oldData;
          }
        );
      }
    }
  );
}
