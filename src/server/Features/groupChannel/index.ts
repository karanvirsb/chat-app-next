import sanitizeHtml from "sanitize-html";

import Id from "../../Utilities/id";
import buildChannel from "./groupChannel";

export default buildChannel({ Id, sanitizeText });

function sanitizeText(text: string) {
  return sanitizeHtml(text);
}
