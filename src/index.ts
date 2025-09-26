import express from "express";
import dotenv from "dotenv";
import routes from "./routes/routes";
import cors from "cors";
dotenv.config();
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use("/api/v1", routes);
app.get("/api/v1/health", (req, res) =>
  res.json({ message: "Kuvaka Backend Assignment API" })
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
