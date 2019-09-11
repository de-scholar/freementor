import express from 'express';
import authRouter from './auth';
import userRouter from './user';
import adminRouter from './admin';
import sessionRouter from './session';
import reviewRouter from './review';

const router = express.Router();

router.use(authRouter);
router.use(userRouter);
router.use(adminRouter);
router.use(sessionRouter);
router.use(reviewRouter);

export default router;
