import { Router } from "express";

export const guardCookieRouter = () => {
  const router = Router();

  router.get("/5-samesite-attr", (req, res) => {
    res.cookie("samesite-default", "samesite-default");
    res.cookie("samesite-lax", "samesite-lax", {
      sameSite: "lax",
    });
    res.cookie("samesite-strict", "samesite-strict", {
      sameSite: "strict",
    });
    res.cookie("samesite-none", "samesite-none", {
      sameSite: "none",
      secure: true,
    });
    res.cookie("samesite-none-unsecure", "samesite-none-unsecure", {
      sameSite: "none",
    });

    res.send(
      '<a href="http://localhost:3000/5-check-cookies"> click me!! </a>'
    );
  });

  router.get("/5-check-cookies", (req, res) => {
    res.send(`
        <p>your cookie is:</p>
        <p>samesite-default: ${req.cookies["samesite-default"]}</p>
        <p>samesite-lax: ${req.cookies["samesite-lax"]}</p>
        <p>samesite-strict: ${req.cookies["samesite-strict"]}</p>
        <p>samesite-none: ${req.cookies["samesite-none"]}</p>
        <p>samesite-none-unsecure: ${req.cookies["samesite-none-unsecure"]}</p>
    `);
  });
  router.post("/5-check-cookies", (req, res) => {
    res.send(`
        <p>your cookie is:</p>
        <p>samesite-default: ${req.cookies["samesite-default"]}</p>
        <p>samesite-lax: ${req.cookies["samesite-lax"]}</p>
        <p>samesite-strict: ${req.cookies["samesite-strict"]}</p>
        <p>samesite-none: ${req.cookies["samesite-none"]}</p>
        <p>samesite-none-unsecure: ${req.cookies["samesite-none-unsecure"]}</p>
    `);
  });

  return router;
};
