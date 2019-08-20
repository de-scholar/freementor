import express from 'express';
import authRouter from './auth';
import adminRouter from './admin';

const router = express.Router();

router.use(authRouter);
router.use(adminRouter);

export default router;