import express, { json } from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import jobsRouter from './routes/jobsRoutes.js';
import userRouter from './routes/userRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 7000;

//middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


//api endpoints
app.use('/api/jobs', jobsRouter)
app.use('/api/user', userRouter)



// running app
app.listen(port, () => {
    connectDB();
    console.log(`Server is running on PORT: ${port}`)
})