import expressServer from "express";
import cookieParser from "cookie-parser";
import { boardRouter } from "./originHandler/1-board";
import { dangerousGetRouter } from "./originHandler/2-password-change";
import { csrfTokenDefenceRouter } from "./originHandler/3-csrf-token-defence";

const app = expressServer();
app.use(cookieParser());
app.use(expressServer.json());
app.use(expressServer.urlencoded({ extended: true }));

app.use(boardRouter());
app.use(dangerousGetRouter());
app.use(csrfTokenDefenceRouter());

console.log("app listening on port: 3000");
app.listen(3000);
