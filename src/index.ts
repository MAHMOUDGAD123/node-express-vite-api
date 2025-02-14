import express, {
  type Request as ExpressRequest,
  type Response as ExpressResponse,
} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import router from "@/router";
import {
  COOKIE_SECRET,
  CORS_OPTIONS,
  SESSION_OPTIONS,
} from "@/utils/constants";

const app = express();

app.use(express.json());
app.use(cookieParser(COOKIE_SECRET));
app.use(session(SESSION_OPTIONS));
app.use(cors(CORS_OPTIONS));
app.use(express.static("public"));
app.use("/api", router);
app.set("view engine", "ejs");

app.get("/", (_req: ExpressRequest, _res: ExpressResponse) => {
  _res.status(200).render("index");
});

app.get("*", (_req: ExpressRequest, _res: ExpressResponse) => {
  _res.status(404).render("404", { pathname: _req.path });
});

if (import.meta.env.DEV) {
  console.log("Development Mode ✅");
}

if (import.meta.env.PROD) {
  console.log("Production Mode ✅");
  const PORT = process.env.PORT ?? 3000;
  app.listen(PORT, () => {
    console.log(`Server Running On Port ${PORT}`);
  });
}

export const viteNodeApp = app; // for vite-node plugin
export default app; // for vercel deployment
