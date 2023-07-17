import { Router } from "express";
import { changePassword, csrfTokens, sessionIds } from "./authModule";
import crypto from "node:crypto";

export const csrfTokenDefenceRouter = () => {
  const router = Router();

  router.get("/3-post-password-change-dangerous", (_req, res) => {
    res.send(`
      <form id="form" action="http://localhost:3000/3-post-password-change-dangerous" method="post">
      <input name="newPassword" type="text" value=""></input>
      <button type="submit">submit</buttion>
      </form>
      `);
  });

  router.post("/3-post-password-change-dangerous", (req, res) => {
    const sessionId = req.cookies["sessionId"];
    const { newPassword } = req.body;
    if (!sessionId || !sessionIds[sessionId]) res.send("login required");
    else if (typeof newPassword !== "string")
      res.send("newPassword is required");
    else {
      const userName = sessionIds[sessionId].userName;
      changePassword(userName, newPassword);
      res.send("password changed!");
    }
  });

  router.get("/3-post-password-change-csrf-token", (_req, res) => {
    const csrfToken = crypto.randomUUID();
    csrfTokens.push(csrfToken);
    res.send(`
      <form id="form" action="http://localhost:3000/3-post-password-change-csrf-token/" method="post">
      <input name="newPassword" type="text" value=""></input>
      <input name="csrfToken" type="hidden" value="${csrfToken}"></input>
      <button type="submit">submit</buttion>
      </form>
      `);
  });

  router.post("/3-post-password-change-csrf-token", (req, res) => {
    const sessionId = req.cookies["sessionId"];
    const { newPassword, csrfToken } = req.body;
    if (!sessionId || !sessionIds[sessionId]) res.send("login required");
    else if (typeof newPassword !== "string" || typeof csrfToken !== "string")
      res.send("newPassword and csrfToken is required");
    else if (!csrfTokens.includes(csrfToken)) {
      console.log("attack detected!!!");
      res.send("you are attacker!!!");
    } else {
      const userName = sessionIds[sessionId].userName;
      changePassword(userName, newPassword);
      res.send("password changed!");
    }
  });

  router.get("/3-post-password-change-with-iframe", (_req, res) => {
    res.send(`
        <iframe id="inlineFrame"
            width="400"
            height="300"
            src="http://localhost:3000/3-post-password-change-csrf-token">
        </iframe>
        <form id="form" action="http://localhost:3000/4-post-password-change/" method="post" style="display: none;">
        <input name="newPassword" type="text" value="aaaaaaa"></input>
        <input name="csrfToken" type="hidden" value="aaaaaaa"></input>
        <button type="submit">submit</buttion>
        </form>
        <script>
            const iframe = document.getElementById("inlineFrame")
            console.log("try to load iframe content via js")
            iframe.contentWindow.onload = () => {
                console.log(iframe.contentWindow.document)
                const csrfToken = iframe.contentWindow.document.getElementsByName("csrfToken")[0]
                console.log(csrfToken)
            }
        </script>
      `);
  });

  router.get("/3-post-password-change-with-xml-http-request", (_req, res) => {
    res.send(`
      <form id="form" action="http://localhost:3000/3-post-password-change-csrf-token/" method="post" style="display: none;">
      <input name="newPassword" type="text" value="aaaaaaa"></input>
      <input name="csrfToken" type="hidden" value="aaaaaaa"></input>
      <button type="submit">submit</buttion>
      </form>
      <script>
          const req = new XMLHttpRequest();
          req.open("GET", "http://localhost:3000/3-post-password-change-csrf-token")
          req.onreadystatechange = () => {
            if(req.readyState === XMLHttpRequest.DONE) {
              console.log("status: " + req.status)
              console.log("response: " + req.responseText)
            }
          }
          req.send()
      </script>
    `);
  });
  return router;
};
