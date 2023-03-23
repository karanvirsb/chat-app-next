import buildPrivateMessage from "./privateMessage";
import Id from "../../Utilities/id";
import sanitize from "sanitize-html";

export default buildPrivateMessage({ Id, sanitizeText });

function sanitizeText(text: string) {
    return sanitize(text);
}
