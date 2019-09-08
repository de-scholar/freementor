import express from 'express';
import authRouter from './auth';
import userRouter from './user';
import adminRouter from './admin';

const router = express.Router();

router.use(authRouter);
router.use(userRouter);
router.use(adminRouter);

export default router;
