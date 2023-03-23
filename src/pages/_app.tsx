import { store } from "@/Redux/store";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import SuperTokensReact, { SuperTokensWrapper } from "supertokens-auth-react";

import { frontendConfig } from "../../config/frontendConfig";
if (typeof window !== "undefined") {
  // we only want to call this init function on the frontend, so we check typeof window !== 'undefined'
  SuperTokensReact.init(frontendConfig());
}
export default function App({ Component, pageProps }: AppProps) {
  return (
    <SuperTokensWrapper>
      <Provider store={store}>
        <Component {...pageProps} />;
      </Provider>
    </SuperTokensWrapper>
  );
}
