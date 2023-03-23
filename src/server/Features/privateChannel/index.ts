import sanitizeHtml from "sanitize-html";
import buildPrivateChannel from "./privateChannel";
import Id from "../../Utilities/id";

export default buildPrivateChannel({ Id, sanitizeText });

function sanitizeText(text: string) {
    return sanitizeHtml(text);
}
