import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { users } from "../data/mock.js";

const router = Router();

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required." });
  }

  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return res.status(409).json({ error: "Email already registered." });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = {
    id: crypto.randomUUID(),
    name,
    email,
    passwordHash,
    emailVerified: false,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);

  return res.status(201).json({
    id: newUser.id,
    name: newUser.name,
    email: newUser.email
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((storedUser) => storedUser.email === email);

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials." });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ error: "Invalid credentials." });
  }

  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: "2h" });

  return res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

export default router;
