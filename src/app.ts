import express, { Application } from 'express'
import mongoose from 'mongoose'
import compression from 'compression'
import cors from 'cors'
import morgan from 'morgan'
// import Controller from './utils/interfaces/controller.interface'
import ErrorMiddleware from './middleware/error.middleware'
import helmet from 'helmet'
import Routes from './routes/routes'

class App {
    public express: Application;
    public port: number

    constructor(port: number) {
        this.express = express();
        this.port = port;

        this.initializeDatabaseConnection()
        this.initializeMiddleware()
        // this.initializeControllers(controllers)
        this.initializeRoutes()
        this.initializeErrorHandling()
    }

    private initializeMiddleware(): void {
        this.express.use(helmet());
        this.express.use(cors())
        this.express.use(morgan('dev'))
        this.express.use(express.json())
        this.express.use(express.urlencoded({ extended: false }))
        this.express.use(compression())
    }

    // private initializeControllers(controllers: Controller[]): void {
    //     controllers.forEach((controller: Controller) => {
    //         this.express.use('/api', controller.router)
    //     })
    // }

    private initializeRoutes(): void {
        const routes = new Routes()
        this.express.use('/api',routes.router)
    }

    private initializeErrorHandling(): void {
        this.express.use(ErrorMiddleware);
    }

    private initializeDatabaseConnection(): void {
        const { MONGO_PATH, MONGO_USER, MONGO_PASSWORD } = process.env

        mongoose.connect(`${MONGO_PATH}`)
        console.log('Database connected')
        // mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`)
    }

    public listen(): void {
        this.express.listen(this.port, () => {
            console.log(`App listening on port ${this.port}`)
        })
    }
}

export default App