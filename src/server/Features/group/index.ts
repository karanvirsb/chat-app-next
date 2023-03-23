import buildGroup from "./group";
import Id from "../../Utilities/id";
import inviteCodeGenerator from "../../Utilities/inviteCodeGenerator";
import sanitizeHtml from "sanitize-html";

export default buildGroup({ Id, inviteCodeGenerator, sanitizeText });

function sanitizeText(text: string) {
    return sanitizeHtml(text);
}