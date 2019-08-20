import express from 'express';
import AdminMw from '../../middleware/admin';
import AdminController from '../../controller/AdminController';
import AuthMw from '../../middleware/auth';

const router = express.Router();
const {authorization,tokenVerify}=AuthMw;
const {isAdmin}=AdminMw;

/* User to mentor*/
router.patch('/user/:userId',
  authorization,
  tokenVerify,
  isAdmin,
  AdminController.userToMentor);

export default router;