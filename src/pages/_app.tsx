import Sidebar from "@/Components/Sidebar";
import { store } from "@/Redux/store";
import SocketHandler from "@/Sockets/SocketHandler";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import SuperTokensReact, { SuperTokensWrapper } from "supertokens-auth-react";

import { frontendConfig } from "../../config/frontendConfig";
if (typeof window !== "undefined") {
  // we only want to call this init function on the frontend, so we check typeof window !== 'undefined'
  SuperTokensReact.init(frontendConfig());
}
export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: Infinity } },
  });
  return (
    <SuperTokensWrapper>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <SocketHandler>
            <>
              <Sidebar></Sidebar>
              <Component {...pageProps} />;
            </>
          </SocketHandler>
        </Provider>
      </QueryClientProvider>
    </SuperTokensWrapper>
  );
}
