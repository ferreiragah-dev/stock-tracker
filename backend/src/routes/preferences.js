import { Router } from "express";
import { preferences, stocks } from "../data/mock.js";

const router = Router();

router.get("/:userId", (req, res) => {
  const { userId } = req.params;
  const userPreferences = preferences.filter((pref) => pref.userId === userId);

  return res.json({ data: userPreferences });
});

router.post("/:userId", (req, res) => {
  const { userId } = req.params;
  const { stockId, isActive, emailAlertEnabled } = req.body;

  const stock = stocks.find((item) => item.id === stockId);
  if (!stock) {
    return res.status(404).json({ error: "Stock not found." });
  }

  const existingPref = preferences.find(
    (pref) => pref.userId === userId && pref.stockId === stockId
  );

  if (existingPref) {
    existingPref.isActive = Boolean(isActive);
    existingPref.emailAlertEnabled = Boolean(emailAlertEnabled);
    return res.json({ data: existingPref });
  }

  const newPreference = {
    id: crypto.randomUUID(),
    userId,
    stockId,
    isActive: Boolean(isActive),
    emailAlertEnabled: Boolean(emailAlertEnabled),
    createdAt: new Date().toISOString()
  };

  preferences.push(newPreference);
  return res.status(201).json({ data: newPreference });
});

export default router;
