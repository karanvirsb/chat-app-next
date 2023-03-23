import cuid from "cuid";

export interface IInviteCodeGenerator {
    makeInviteCode: () => string;
}

function makeInviteCode() {
    return cuid.slug();
}

export default { makeInviteCode };
