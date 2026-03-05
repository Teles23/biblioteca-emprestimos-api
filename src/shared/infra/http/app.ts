import express from 'express';
import cors from 'cors';

import { errorMiddleware } from '../middlewares/error.middleware';
import { router } from './routes';

export const app = express();
app.use(cors());
app.use(express.json());
app.use(router);
app.use(errorMiddleware);
