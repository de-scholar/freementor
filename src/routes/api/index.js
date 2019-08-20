import express from 'express';
import authRouter from './auth';
import adminRouter from './admin';
import userRouter from './user';

const router = express.Router();

router.use(authRouter);
router.use(adminRouter);
router.use(userRouter);

export default router;