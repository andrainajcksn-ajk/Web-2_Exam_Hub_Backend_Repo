
import express from 'express';
import authRoutes from './routes/authRoutes'; 
import { authenticate, authorize } from './Security/authMiddleware';
import { notFoundHandler, errorHandler } from './middlewares/errorHandler';

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);


app.use(notFoundHandler);
app.use(errorHandler);

export default app;
