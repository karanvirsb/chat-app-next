import sanitize from "sanitize-html";

import Id from "../../Utilities/id";
import buildPrivateMessage from "./privateMessage";

export default buildPrivateMessage({ Id, sanitizeText });

function sanitizeText(text: string) {
  return sanitize(text);
}
