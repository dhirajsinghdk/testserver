import express from "express"
import http from "http"
import "dotenv/config"
import dbConnect from "./database/db"
import Logger from "./middleware/logsHandler"
import {configureMiddleware} from "./middleware/securitymiddleware"
import combinedRoutes from "./config/combinedRoutes"

const app = express()
const server = http.createServer(app)
const PORT =process.env.PORT


configureMiddleware(app)
combinedRoutes(app)

app.get("/", (req, res) => {
  res.status(200).send(
    `Server started ...`
  );
});

dbConnect().then(
    async () =>{
        server.listen(PORT, ()=>Logger.info(`Server running at port ${PORT}`))
    }
)