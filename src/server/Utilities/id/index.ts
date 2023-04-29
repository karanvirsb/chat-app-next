import { v4 as uuid } from "uuid";

export interface IId {
  makeId: () => string;
}

export const makeId = () => {
  return uuid();
};
