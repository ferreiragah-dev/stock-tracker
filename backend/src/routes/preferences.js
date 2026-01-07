import { Router } from "express";
import { supabase } from "../lib/supabase.js";

const router = Router();

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  const { data, error } = await supabase
    .from("preferences")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json({ data });
});

router.post("/:userId", async (req, res) => {
  const { userId } = req.params;
  const { stockId, isActive, emailAlertEnabled } = req.body;

  if (!stockId) {
    return res.status(400).json({ error: "Stock id is required." });
  }

  const { data, error } = await supabase
    .from("preferences")
    .upsert(
      {
        user_id: userId,
        stock_id: stockId,
        is_active: Boolean(isActive),
        email_alert_enabled: Boolean(emailAlertEnabled)
      },
      { onConflict: "user_id,stock_id" }
    )
    .select("*")
    .single();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(201).json({ data });
});

export default router;
