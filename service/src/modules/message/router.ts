import { newOpenAPIHono } from "@/lib/router";

import registerGetMessages from "@/modules/message/endpoints/getMessages";
import registerPostMessage from "@/modules/message/endpoints/postMessage";

const router = newOpenAPIHono();

registerGetMessages(router);
registerPostMessage(router);

export default router;
