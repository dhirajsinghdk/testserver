import morgan from "morgan"
import express from "express"
import helmet from "helmet"
import cors from "cors"

const configureMiddleware =(app:express.Application):void=>{
    const corsEntryPoint={
        origin:"*"
    }
    app.use(cors(corsEntryPoint));

    const environment = process.env.NODE_ENV || "development"
    app.use(morgan(environment === "development" ? "dev" :"combined"))
    app.use(express.urlencoded({extended:false}))

    app.use(express.json({limit:"1mb"}))

    app.use(helmet.frameguard())
    app.use(helmet.xssFilter())
    app.use(helmet.noSniff())

    app.use(helmet.hsts({
        maxAge:7776000000,
        includeSubDomains:true
    }))
}

export {
    configureMiddleware
}