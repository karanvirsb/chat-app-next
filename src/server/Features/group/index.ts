import sanitizeHtml from "sanitize-html";

import Id from "../../Utilities/id";
import inviteCodeGenerator from "../../Utilities/inviteCodeGenerator";
import buildGroup from "./group";

export default buildGroup({ Id, inviteCodeGenerator, sanitizeText });

function sanitizeText(text: string) {
  return sanitizeHtml(text);
}
