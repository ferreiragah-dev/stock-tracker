import { Router } from "express";
import { supabase } from "../lib/supabase.js";

const router = Router();

router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("stocks").select("*").order("symbol");
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  return res.json({ data });
});

router.post("/", async (req, res) => {
  const { symbol, name, exchange } = req.body;
  if (!symbol || !name) {
    return res.status(400).json({ error: "Symbol and name are required." });
  }

  const { data, error } = await supabase
    .from("stocks")
    .insert([{ symbol, name, exchange }])
    .select("*")
    .single();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(201).json({ data });
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { symbol, name, exchange } = req.body;

  const { data, error } = await supabase
    .from("stocks")
    .update({ symbol, name, exchange })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.json({ data });
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("stocks").delete().eq("id", id);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(204).send();
});

export default router;
