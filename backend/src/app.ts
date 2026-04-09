import  express  from "express";

const app = express();


app.get("/health", (req, res) => {
    res.status(200).send("Hello from backend");
});


export default app;
