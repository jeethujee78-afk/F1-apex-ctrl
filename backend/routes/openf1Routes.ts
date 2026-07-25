import { Router } from "express";
import {
  getYears,
  getMeetings,
  getSessionsList,
  getSessions,
  getDrivers,
  getExactResults,
  getWeather,
  getLaps,
  getIntervals,
  getStints,
  getPositions,
  getTeamRadio,
  getCarData,
} from "../controllers/openf1Controller";

const router = Router();

router.get("/years", getYears);
router.get("/meetings", getMeetings);
router.get("/sessions-list", getSessionsList);
router.get("/sessions", getSessions);
router.get("/drivers", getDrivers);
router.get("/exact-results", getExactResults);

// Redirect logic exactly identical to original server.ts
router.get("/session_result", (req, res) => {
  const sessionUrl = `/api/openf1/exact-results?${new URLSearchParams(req.query as any).toString()}`;
  res.redirect(sessionUrl);
});

router.get("/weather", getWeather);
router.get("/laps", getLaps);
router.get("/intervals", getIntervals);
router.get("/stints", getStints);
router.get("/positions", getPositions);
router.get("/team_radio", getTeamRadio);
router.get("/car_data", getCarData);

export default router;
