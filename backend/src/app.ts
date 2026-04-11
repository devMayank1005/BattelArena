import  express  from "express";
import useGraph from "./services/graph.ai.service.js";
const app = express();


app.get("/health", (req, res) => {
    
    res.status(200).send("Hello from backend");
});
app.post("/use-graph", async(req, res) => {
    await useGraph("wreite factorial of function in js"); // Example user message
    res.status(200)
});

export default app;
