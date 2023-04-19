import Sidebar from "@/Components/Sidebar";
import { store } from "@/Redux/store";
import SocketHandler from "@/Sockets/SocketHandler";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";

import { Layout } from "@/Components/Layout";
import { SessionProvider } from "next-auth/react";
import ModalDisplay from "@/Components/Modal/ModalDisplay";
if (typeof window !== "undefined") {
  // we only want to call this init function on the frontend, so we check typeof window !== 'undefined'
  // SuperTokensReact.init(frontendConfig());
}
const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: Infinity } },
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
            <Layout>
              <Component {...pageProps} />;
            </Layout>
          </SocketHandler>
        </Provider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
