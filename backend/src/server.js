import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import stocksRoutes from "./routes/stocks.js";
import preferencesRoutes from "./routes/preferences.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDir = path.resolve(__dirname, "../../frontend");

app.use(cors());
app.use(express.json());
app.use(express.static(frontendDir));

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/auth", authRoutes);
app.use("/stocks", stocksRoutes);
app.use("/preferences", preferencesRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendDir, "index.html"));
});

app.listen(port, () => {
  console.log(`Stock Tracker API running on port ${port}`);
});
