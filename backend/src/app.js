import express from "express";
import cors from "cors";
import roomRoutes from "./routes/roomRoutes.js";
import verificationRoutes from "./routes/verificationRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { ENV } from "./config/env.js";

const app = express();

// Middleware
app.use(cors({
  origin: ENV.CORS_ORIGIN,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use("/api", roomRoutes);
app.use("/api", verificationRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({
    name: "JustPost API",
    version: "1.0.0",
    status: "running",
    features: {
      relay: true,
      blockchain: ENV.BLOCKCHAIN_ENABLED,
      ipPrivacy: true
    }
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString()
  });
});

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
