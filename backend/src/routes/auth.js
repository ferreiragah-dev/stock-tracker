import { Router } from "express";
import { supabase } from "../lib/supabase.js";

const router = Router();

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required." });
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name }
  });

  if (error) {
    const status = error.status === 409 ? 409 : 400;
    return res.status(status).json({ error: error.message });
  }

  return res.status(201).json({
    id: data.user.id,
    name: data.user.user_metadata?.name ?? name,
    email: data.user.email
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error || !data.session || !data.user) {
    return res.status(401).json({ error: error?.message ?? "Invalid credentials." });
  }

  return res.json({
    token: data.session.access_token,
    user: {
      id: data.user.id,
      name: data.user.user_metadata?.name ?? "",
      email: data.user.email
    }
  });
});

export default router;
