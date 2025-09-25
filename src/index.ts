import express from "express";
import dotenv from "dotenv";
import routes from "./routes/routes";
dotenv.config();
const app = express();
app.use(express.json());

app.use("api/v1", routes);
app.get("/", (req, res) => res.send("Kuvaka Backend Assignment API"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
