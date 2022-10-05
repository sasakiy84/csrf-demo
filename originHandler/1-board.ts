import { Router } from "express";

// go to http://localhost:3000/1-get-board?text=%E7%A7%81%E3%81%AF%E6%B0%97%E8%B1%A1%E5%BA%81%E3%82%92%E7%88%86%E7%A0%B4%E3%81%97%E3%81%BE%E3%81%99
export const boardRouter = () => {
  const router = Router();
  router.get("/1-get-board", (req, res) => {
    const ip = req.ip;
    const postedText = req.query.text;
    if (!postedText) {
      res.send("query: text is required");
      return;
    }
    console.log(`user: ${ip} ::: ${postedText}`);
    res.send(
      `<p>全体掲示板：今日の投稿<br />user: ${ip} ::: ${postedText}</p>`
    );
  });
  return router;
};
