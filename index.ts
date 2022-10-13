import expressServer from "express";
import cookieParser from "cookie-parser";
import { boardRouter } from "./originHandler/1-board";
import { dangerousGetRouter } from "./originHandler/2-password-change";
import { csrfTokenDefenceRouter } from "./originHandler/3-csrf-token-defence";
import { checkHeaderRouter } from "./originHandler/4-check-header";
import { guardCookieRouter } from "./originHandler/5-guard-cookie";

const app = expressServer();
app.use(cookieParser());
app.use(expressServer.json());
app.use(expressServer.urlencoded({ extended: true }));

app.use(boardRouter());
app.use(dangerousGetRouter());
app.use(csrfTokenDefenceRouter());
app.use(checkHeaderRouter());
app.use(guardCookieRouter());

console.log("app listening on port: 3000");
app.listen(3000);
