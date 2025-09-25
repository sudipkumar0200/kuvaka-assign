import express from "express";
import dotenv from "dotenv";
import offerRouter from "./routes/offer";
import leadsRouter from "./routes/leads";

dotenv.config();
const app = express();
app.use(express.json());

app.use("/offer", offerRouter);
app.use("/leads", leadsRouter);

app.get("/", (req, res) => res.send("Kuvaka Backend Assignment API"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));