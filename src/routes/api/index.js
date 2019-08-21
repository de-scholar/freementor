import express from 'express';
import authRouter from './auth';
import adminRouter from './admin';
import userRouter from './user';
import sessionRouter from './session';

const router = express.Router();

router.use(authRouter);
router.use(adminRouter);
router.use(userRouter);
router.use(sessionRouter);

export default router;