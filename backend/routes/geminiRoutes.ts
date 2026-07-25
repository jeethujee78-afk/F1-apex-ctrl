import { Router } from "express";
import { getStrategy, getAnalysis } from "../controllers/geminiController";

const router = Router();

router.post("/strategy", getStrategy);
router.post("/analyze", getAnalysis);

export default router;
