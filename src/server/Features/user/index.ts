// import Id from "../../Utilities/id";
import sanitizeHtml from "sanitize-html";

import buildUser from "./user";

export default buildUser({ sanitizeText });

function sanitizeText(text: string) {
  return sanitizeHtml(text);
}
