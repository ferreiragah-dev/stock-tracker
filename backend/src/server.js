import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import stocksRoutes from "./routes/stocks.js";
import preferencesRoutes from "./routes/preferences.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/auth", authRoutes);
app.use("/stocks", stocksRoutes);
app.use("/preferences", preferencesRoutes);

app.listen(port, () => {
  console.log(`Stock Tracker API running on port ${port}`);
});
