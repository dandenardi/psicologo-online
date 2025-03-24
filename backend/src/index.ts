import express from 'express';
import connectDB from './config/database';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';


const app = express();

connectDB();

app.use(express.json());


app.use('/users', userRoutes);
app.use('/auth', authRoutes);



export default app;
