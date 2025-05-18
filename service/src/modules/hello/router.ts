import { newOpenAPIHono } from "@/lib/router";

import registerGetHello from "@/modules/hello/endpoints/getHello";
import registerPostHello from "@/modules/hello/endpoints/postHello";

const router = newOpenAPIHono();

registerGetHello(router);
registerPostHello(router);

export default router;
