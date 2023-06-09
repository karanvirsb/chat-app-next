import "@/styles/globals.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";

import ModalDisplay from "@/Components/Modal/ModalDisplay";
import { store } from "@/Redux/store";
import SocketHandler from "@/Sockets/SocketHandler";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <SocketHandler>
            <ModalDisplay></ModalDisplay>
            <Component {...pageProps} />
          </SocketHandler>
        </Provider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
