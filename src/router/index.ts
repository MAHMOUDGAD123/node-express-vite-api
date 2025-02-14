import {
  Router,
  type Request as ExpressRequest,
  type Response as ExpressResponse,
} from "express";
import type { Session } from "express-session";

// caching
import { createCache } from "cache-manager";
import { CACHE } from "@/utils/constants";

const memCache = createCache({
  ttl: CACHE.TTL,
  refreshThreshold: CACHE.refreshThreshold(),
});

const router: Router = Router();

// routes
router.get("/", async (_req: ExpressRequest, _res: ExpressResponse) => {
  type DataType = {
    msg: string;
    timestamp: number;
  };

  const cacheKey = "__key__";
  const cachedValue = (await memCache.get(cacheKey)) as DataType;

  if (cachedValue) {
    _res.status(200).json(cachedValue);
    console.log("\x1b[36m\x1b[1m[Served From Cache]\x1b[0m\x1b[0m");
    return;
  }

  const data: DataType = {
    msg: "Welcome to our RESTful API",
    timestamp: Date.now(),
  };

  memCache.set(cacheKey, data);
  _res.status(200).json(data);
  console.log("\x1b[31m\x1b[1m[Served From Source]\x1b[0m\x1b[0m");
});

type BodyData = { [k: string]: any };
type SesssionType = Session & {
  connected: boolean;
  data: { info: BodyData; date: string; sessionID: string };
};

router.post("/login", (_req: ExpressRequest, _res: ExpressResponse) => {
  const bodyData = _req.body as BodyData;
  const session = _req.session as SesssionType;

  if (session.connected) {
    _res.status(200).json({ msg: "connected 😊" });
    console.log("\x1b[36m\x1b[1m[connected]\x1b[0m\x1b[0m");
  } else {
    session.connected = true;
    session.data = {
      info: bodyData,
      date: new Date().toLocaleTimeString(),
      sessionID: _req.sessionID,
    };
    _res.status(401).json({ msg: "connected now 🔗" });
    console.log("\x1b[34m\x1b[1m[open-connection]\x1b[0m\x1b[0m");
  }
});

router.get("/profile", (_req: ExpressRequest, _res: ExpressResponse) => {
  type BodyData = { id: string; name: string; age: string };
  const session = _req.session as Session & {
    connected: boolean;
    data: { info: BodyData; date: string; sessionID: string };
  };

  if (session.connected) {
    _res.status(200).json({ info: session.data.info });
    console.log("\x1b[32m\x1b[1m[authorized]\x1b[0m\x1b[0m");
  } else {
    _res.status(401).json({ error: "unauthorized 🟥" });
    console.log("\x1b[31m\x1b[1m[unauthorized]\x1b[0m\x1b[0m");
  }
});

export default router;
