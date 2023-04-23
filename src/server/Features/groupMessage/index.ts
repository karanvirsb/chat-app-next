import sanitize from "sanitize-html";

import Id from "../../Utilities/id";
import buildMessage from "./groupMessage";

export default buildMessage({ Id, sanitizeText });

function sanitizeText(text: string) {
  return sanitize(text);
}
