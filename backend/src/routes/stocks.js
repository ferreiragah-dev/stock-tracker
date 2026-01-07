import { Router } from "express";
import { stocks } from "../data/mock.js";

const router = Router();

router.get("/", (req, res) => {
  return res.json({ data: stocks });
});

export default router;
