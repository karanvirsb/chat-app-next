import Express, { Request, Response } from "express";
// import QueryString from "qs";

export type IHttpRequest = typeof Express.request;

// export interface IHttpRequest {
//   body: any;
//   query: QueryString.ParsedQs;
//   params: ParamsDictionary;
//   ip: string;
//   method: string;
//   path: string;
//   headers: {
//     [key: string]: string | undefined;
//   };
// }

export type httpResponseType = {
  headers: { [key: string]: string };
  statusCode: number;
  body: {
    success: boolean;
    data: any | undefined;
    error: string;
  };
};

export interface IController<T> {
  (httpRequest: IHttpRequest): Promise<ControllerReturn<T>>;
}

export default function makeExpressCallback<T>(controller: IController<T>) {
  return (req: Request, res: Response) => {
    // const httpRequest: IHttpRequest = {
    //   body: req.body,
    //   query: req.query,
    //   params: req.params,
    //   ip: req.ip,
    //   method: req.method,
    //   path: req.path,
    //   headers: {
    //     "Content-Type": req.get("Content-Type"),
    //     Referer: req.get("referer"),
    //     "User-Agent": req.get("User-Agent"),
    //   },
    // };
    controller(req)
      .then((httpResponse: ControllerReturn<T>) => {
        if (httpResponse.headers) {
          res.set(httpResponse.headers);
        }
        res.type("json");
        res.status(httpResponse.statusCode).send(httpResponse.body);
      })
      .catch((e) =>
        res.status(500).send({ error: "An unkown error occurred." })
      );
  };
}
