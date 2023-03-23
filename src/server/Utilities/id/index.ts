import cuid from "cuid";

export interface IId {
    makeId: () => string;
}

const makeId = () => {
    return cuid();
};

export default { makeId };
