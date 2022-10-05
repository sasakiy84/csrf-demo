import { Router } from "express";

export const checkHeaderRouter = () => {
  const router = Router();

  router.get("/4-prepare-check-referer-or-origin-or-metadata", (_req, res) => {
    res.send(
      `<form action="http://localhost:3000/4-prepare-check-headers" method="post">
        <button type="submit">submit</buttion>
      </form>`
    );
  });
  router.get("/4-prepare-custom-header", (_req, res) => {
    res.send(
      `
        <button id="button">submit</button>
        <p id="response"></p>
        <script>
            const button = document.getElementById("button")
            button.addEventListener("click", () => {
                const req = new XMLHttpRequest();
                req.open("POST", "http://localhost:3000/4-prepare-check-headers")
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
  router.post("/4-prepare-check-headers", (req, res) => {
    const referer = req.get("Referer");
    const origin = req.get("Origin");
    const customHeader = req.get("x-powered-by-myapp");
    const SecFetchSite = req.get("Sec-Fetch-Site");
    // chech headers
    console.log("referer: " + referer);
    console.log("origin: " + origin);
    console.log("is custom header exists: " + !!customHeader);
    console.log("Sec-Fetch-Site: " + SecFetchSite);
    console.log("server side program executed!!!");
    res.send("server side program executed!!!");
  });

  return router;
};
