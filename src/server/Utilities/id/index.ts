import { v4 as uuid } from "uuid";

export interface IId {
  makeId: () => string;
}

const makeId = () => {
  return uuid();
};

export default { makeId };
