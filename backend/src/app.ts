import  express  from "express";
import useGraph from "./services/graph.ai.service.js";
const app = express();


app.get("/health", (req, res) => {
    res.status(200).send("Hello from backend");
});
app.post("/use-graph", async(req, res) => {
    await useGraph("Hello, how are you?"); // Example user message
    res.status(200).send("Hello from backend");
});

export default app;
