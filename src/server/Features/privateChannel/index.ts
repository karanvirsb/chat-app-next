import sanitizeHtml from "sanitize-html";

import Id from "../../Utilities/id";
import buildPrivateChannel from "./privateChannel";

export default buildPrivateChannel({ Id, sanitizeText });

function sanitizeText(text: string) {
  return sanitizeHtml(text);
}
