import expressServer from "express";
import crypto, { randomUUID } from "node:crypto";
import cookieParser from "cookie-parser";

type Users = {
  [name: string]: {
    password: string;
  };
};

type SessionIds = {
  [sessionId: string]: {
    userName: string;
  };
};
const users: Users = {
  wowow: {
    password: "whooo!",
  },
};
const sessionIds: SessionIds = {};
const csrfTokens: string[] = [];

const app = expressServer();
app.use(cookieParser());
app.use(expressServer.json());
app.use(expressServer.urlencoded({ extended: true }));

// go to http://localhost:3000/1-get-board?text=%E7%A7%81%E3%81%AF%E6%B0%97%E8%B1%A1%E5%BA%81%E3%82%92%E7%88%86%E7%A0%B4%E3%81%97%E3%81%BE%E3%81%99
app.get("/1-get-board", (req, res) => {
  const ip = req.ip;
  const postedText = req.query.text;
  if (!postedText) {
    res.send("query: text is required");
    return;
  }
  console.log(`user: ${ip} ::: ${postedText}`);
  res.send("めっちゃ面白いコンテンツ");
});

app.get("/2-get-login", (req, res) => {
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
    res.cookie("sessionId", sessionId);
    res.send("logined!");
  } else {
    res.send("name or password is incorrect");
  }
});

app.get("/2-get-confirm", (req, res) => {
  const sessionId = req.cookies["sessionId"];
  if (!sessionId || !sessionIds[sessionId]) res.send("login required");
  else res.send(`you are ${sessionIds[sessionId].userName}`);
});

app.get("/2-get-password-change", (req, res) => {
  const sessionId = req.cookies["sessionId"];
  const newPassword = req.query.password;
  if (!sessionId || !sessionIds[sessionId]) res.send("login required");
  else if (typeof newPassword !== "string") res.send("newPassword is required");
  else {
    const userName = sessionIds[sessionId].userName;
    users[userName].password = newPassword;
    console.log(`${userName} password is changed to ${newPassword}`);
    res.send("password changed!");
  }
});

app.post("/3-post-password-change", (req, res) => {
  const sessionId = req.cookies["sessionId"];
  const { newPassword } = req.body;
  if (!sessionId || !sessionIds[sessionId]) res.send("login required");
  if (typeof newPassword !== "string") res.send("newPassword is required");
  else {
    const userName = sessionIds[sessionId].userName;
    users[userName].password = newPassword;
    console.log(`${userName} password is changed to ${newPassword}`);
    res.send("password changed!");
  }
});

app.get("/4-post-password-change", (_req, res) => {
  const csrfToken = crypto.randomUUID();
  csrfTokens.push(csrfToken);
  res.send(`
    <form id="form" action="http://localhost:3000/4-post-password-change/" method="post">
    <input name="newPassword" type="text" value=""></input>
    <input name="csrfToken" type="hidden" value="${csrfToken}"></input>
    <button type="submit">submit</buttion>
    </form>
    `);
});

app.post("/4-post-password-change", (req, res) => {
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
    users[userName].password = newPassword;
    console.log(`${userName} password is changed to ${newPassword}`);
    res.send("password changed!");
  }
});

app.get("/4-post-password-change-with-iframe", (_req, res) => {
  res.send(`
      <iframe id="inlineFrame"
          width="400"
          height="300"
          src="http://localhost:3000/4-post-password-change">
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

console.log("app listening on port: 3000");
app.listen(3000);
