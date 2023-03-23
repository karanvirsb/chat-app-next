import supertokens, { deleteUser } from "supertokens-node";
import Session from "supertokens-node/recipe/session";
import EmailPassword from "supertokens-node/recipe/emailpassword";
import { addUserUC } from "../src/Features/user/AddUser";
import { getUser } from "../src/Features/user/use-cases";
import { IUser } from "../src/Features/user/user";
import { GeneralErrorResponse } from "supertokens-node/lib/build/types";

type signupResponse =
  | {
      status: "OK";
      user: EmailPassword.User;
      session: Session.SessionContainer;
    }
  | {
      status: "EMAIL_ALREADY_EXISTS_ERROR";
    }
  | GeneralErrorResponse;

supertokens.init({
  framework: "express",
  supertokens: {
    // try.supertokens.com is for demo purposes. Replace this with the address of your core instance (sign up on supertokens.com), or self host a core.
    connectionURI: process.env.SUPERTOKENS_CONNECTION_URI!,
    // apiKey: "IF YOU HAVE AN API KEY FOR THE CORE, ADD IT HERE",
  },
  appInfo: {
    // learn more about this on https://supertokens.com/docs/session/appinfo
    appName: "chat app",
    apiDomain: process.env.API_DOMAIN!,
    websiteDomain: process.env.WEBSITE_DOMAIN!,
    apiBasePath: "/auth",
    websiteBasePath: "/auth",
  },
  recipeList: [
    EmailPassword.init({
      signUpFeature: {
        formFields: [
          {
            id: "username",
          },
          {
            id: "email",
          },
          {
            id: "password",
          },
        ],
      },
      override: {
        apis: (originalImplementation) => {
          return {
            ...originalImplementation,
            signUpPOST: signUpPost(originalImplementation),
            signInPOST: signInPost(originalImplementation),
          };
        },
      },
    }), // initializes signin / sign up features
    Session.init({
      override: {
        functions: (originalImplementation) => {
          return {
            ...originalImplementation,
            createNewSession: async function (input) {
              let userId = input.userId;

              const user = await getUser(userId);

              if (user.success && user.data !== undefined) {
                input.accessTokenPayload = {
                  ...input.accessTokenPayload,
                  ...user.data,
                };
              }
              return originalImplementation.createNewSession(input);
            },
          };
        },
      },
    }), // initializes session features
  ],
});

function signInPost(originalImplementation: EmailPassword.APIInterface):
  | ((input: {
      formFields: { id: string; value: string }[];
      options: EmailPassword.APIOptions;
      userContext: any;
    }) => Promise<
      | {
          status: "OK";
          user: EmailPassword.User;
          session: Session.SessionContainer;
        }
      | { status: "WRONG_CREDENTIALS_ERROR" }
      | GeneralErrorResponse
    >)
  | undefined {
  return async function (input) {
    if (originalImplementation.signInPOST === undefined) {
      throw Error("Should never come here");
    }

    // First we call the original implementation of signInPOST.
    let response = await originalImplementation.signInPOST(input);
    try {
      // Post sign up response, we check if it was successful
      if (response.status === "OK") {
        let { id } = response.user;

        const user = await getUser(id);

        if (user.success && user.data !== undefined) {
          response.user = {
            ...response.user,
          };
        } else {
          throw new Error(user.error);
        }
      }
    } catch (error) {
      console.log(error);
      return {
        status: "GENERAL_ERROR",
        message: `${error}`,
      };
    }
    return response;
  };
}

function signUpPost(originalImplementation: EmailPassword.APIInterface):
  | ((input: {
      formFields: { id: string; value: string }[];
      options: EmailPassword.APIOptions;
      userContext: any;
    }) => Promise<
      | GeneralErrorResponse
      | {
          status: "OK";
          user: EmailPassword.User;
          session: Session.SessionContainer;
        }
      | { status: "EMAIL_ALREADY_EXISTS_ERROR" }
    >)
  | undefined {
  return async function (input) {
    if (originalImplementation.signUpPOST === undefined) {
      throw Error("Should never come here");
    }

    const user: IUser = createUserObj(input);

    let response: signupResponse = await originalImplementation.signUpPOST(
      input
    );

    try {
      if (response.status === "OK") {
        response.user = {
          ...response.user,
          ...user,
        };

        user.userId = response.user.id;
        // adding user into database
        const addedUser = await addUserUC(user);
        if (addedUser.error) {
          throw new Error(addedUser.error);
        }
      }
    } catch (error) {
      console.log(error);
      // clean up if fails delete user
      if (user.userId) {
        deleteUser(user.userId);
      } else if (response.status === "OK") {
        deleteUser(response.user.id);
      }

      return {
        status: "GENERAL_ERROR",
        message: `${error}`,
      };
    }

    return response;
  };
}

function createUserObj(input: {
  formFields: { id: string; value: string }[];
  options: EmailPassword.APIOptions;
  userContext: any;
}) {
  const user: IUser = {
    userId: "",
    status: "",
    username: "",
  };

  // These are the input form fields values that the user used while signing up
  let formFields = input.formFields;

  // so here we are adding email, username
  formFields.forEach((field) => {
    if (field.id === "username") {
      user[field.id] = field.value;
    }
  });

  user["status"] = "online";
  return user;
}

export default supertokens;
