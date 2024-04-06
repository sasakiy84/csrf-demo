import { Router } from "express";
import { changePassword, sessionIds, users } from "./authModule";
import crypto from "node:crypto";

export const dangerousGetRouter = () => {
  const router = Router();

  router.get("/2-get-login", (req, res) => {
    const { name, password } = req.query;
    if (typeof name !== "string" || typeof password !== "string") {
      res.send("query: name and password is required");
      return;
    }

    if (users[name] && users[name].password === password) {
      const sessionId = crypto.randomUUID();
      sessionIds[sessionId] = {
        userName: name,
      };
      console.log(`registered sessionId ${sessionId} for user ${name}`);
      res.cookie("sessionId", sessionId, {
        sameSite: "none",
        secure: true,
      });
      res.send("logined!");
    } else {
      res.send("name or password is incorrect");
    }
  });

  router.get("/2-get-confirm", (req, res) => {
    const sessionId = req.cookies["sessionId"];
    if (!sessionId || !sessionIds[sessionId]) res.send("login required");
    else res.send(`you are ${sessionIds[sessionId].userName}`);
  });

  router.get("/2-get-password-change", (req, res) => {
    const sessionId = req.cookies["sessionId"];
    const newPassword = req.query.newPassword;
    if (!sessionId || !sessionIds[sessionId]) res.send("login required");
    else if (typeof newPassword !== "string")
      res.send("newPassword is required");
    else {
      const userName = sessionIds[sessionId].userName;
      changePassword(userName, newPassword);
      res.send("password changed!");
    }
  });
  return router;
};
