require("dotenv").config();
import axios from "axios";
import FormData from "form-data";
import pipe from "../pipe";

const createFormDataForName = (username: string) => {
    const data = new FormData();
    data.append("text", username);
    data.append("lang", "en");
    data.append("mode", "username");
    data.append("api_user", process.env.SANITIZE_API_USER);
    data.append("api_secret", process.env.SANITIZE_API_SECRET);
    return data;
};

const checkName = async (data: FormData): Promise<boolean | number> => {
    return axios({
        url: "https://api.sightengine.com/1.0/text/check.json",
        method: "post",
        data: data,
        headers: data?.getHeaders(),
    })
        .then((resp) => {
            return resp.data?.profanity?.matches?.length > 0;
        })
        .catch((err) => {
            // doing something
            console.log(err);
            return -1;
        });
};

export interface IModerate {
    moderateUsername: (param: any) => Promise<number | boolean>;
}

// export const sanitizeName = async (name: string): Promise<number | boolean> =>
//     await checkName(createFormDataForName(name));

export const moderateName = pipe<number | boolean>(
    createFormDataForName,
    checkName
);
