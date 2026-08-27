
import express from 'express';
import authRoutes from './routes/authRoutes';
import courseRoutes from './routes/courseRoutes';
import studentRoutes from './routes/studentRoutes';
import { notFoundHandler, errorHandler } from './middlewares/errorHandler';

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/students', studentRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
