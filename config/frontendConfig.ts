import ThirdPartyEmailPasswordReact from "supertokens-auth-react/recipe/thirdpartyemailpassword";
import EmailVerificationReact from "supertokens-auth-react/recipe/emailverification";
import SessionReact from "supertokens-auth-react/recipe/session";
import { appInfo } from "./appInfo";
import Router from "next/router";
import { Url } from "next/dist/shared/lib/router/router";
import EmailPasswordReact from "supertokens-auth-react/recipe/emailpassword";

export let frontendConfig = () => {
  return {
    appInfo,
    recipeList: [
      EmailPasswordReact.init({
        signInAndUpFeature: {
          signUpForm: {
            formFields: [
              {
                id: "username",
                label: "Username",
                placeholder: "Enter an username",
              },
              {
                id: "email",
                label: "Email",
                placeholder: "Enter an email",
              },
              {
                id: "password",
                label: "password",
                placeholder: "Enter a password",
              },
            ],
          },
        },
      }),
      SessionReact.init(),
    ],
    // this is so that the SDK uses the next router for navigation
    windowHandler: (oI) => {
      return {
        ...oI,
        location: {
          ...oI.location,
          setHref: (href: Url) => {
            Router.push(href);
          },
        },
      };
    },
  };
};
