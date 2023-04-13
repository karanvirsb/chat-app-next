import SessionNode, {
  APIInterface,
  SessionContainer,
} from "supertokens-node/recipe/session";
import { appInfo } from "./appInfo";
// import { AuthConfig } from "../interfaces";
import DashboardNode from "supertokens-node/recipe/dashboard";
import EmailPasswordReact from "supertokens-auth-react/recipe/emailpassword";
import { IUser } from "@/Hooks/groupHooks";
import { deleteUser } from "supertokens-node";
import { GeneralErrorResponse } from "supertokens-node/lib/build/types";
import { APIOptions } from "supertokens-node/lib/build/recipe/jwt";
import { User } from "supertokens-auth-react/lib/build/recipe/authRecipe/types";
import { RecipeInterface } from "supertokens-web-js/recipe/session";
import { getUser } from "@/server/Features/user/use-cases";
import { addUserUC } from "@/server/Features/user/AddUser";

export let backendConfig = () => {
  return {
    framework: "nextjs",
    supertokens: {
      connectionURI: "https://try.supertokens.io",
    },
    appInfo,
    recipeList: [
      EmailPasswordReact.init({
        signInAndUpFeature: {
          signUpForm: {
            formFields: [
              {
                id: "username",
                label: "username",
              },
              {
                id: "email",
                label: "email",
              },
              {
                id: "password",
                label: "password",
              },
            ],
          },
        },
        override: {
          functions: (originalImplementation) => {
            return {
              ...originalImplementation,

              signUpPOST: signUpPost(originalImplementation),
              signInPOST: signInPost(originalImplementation),
            };
          },
        },
      }),

      SessionNode.init(),
      DashboardNode.init(),
    ],
  };
};

function signInPost(originalImplementation: any):
  | ((input: {
      formFields: { id: string; value: string }[];
      options: APIOptions;
      userContext: any;
    }) => Promise<
      | {
          status: "OK";
          user: User;
          session: SessionContainer;
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

function signUpPost(originalImplementation: any):
  | ((input: {
      formFields: { id: string; value: string }[];
      options: any;
      userContext: any;
    }) => Promise<
      | GeneralErrorResponse
      | {
          status: "OK";
          user: any;
          session: any;
        }
      | { status: "EMAIL_ALREADY_EXISTS_ERROR" }
    >)
  | undefined {
  return async function (input) {
    if (originalImplementation.signUpPOST === undefined) {
      throw Error("Should never come here");
    }

    const user: IUser = createUserObj(input);

    let response: any = await originalImplementation.signUpPOST(input);

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
  options: any;
  userContext: any;
}) {
  const user: IUser = {
    userId: "",
    status: "",
    username: "",
    email: "",
    time_joined: new Date(),
    roles: [],
    groupId: "",
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
