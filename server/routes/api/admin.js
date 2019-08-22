import express from 'express';
import permissionMw from '../../middleware/permission';
import AdminController from '../../controllers/AdminController';
import AuthMw from '../../middleware/auth';

const router = express.Router();
const {authorization,tokenVerify}=AuthMw;
const {isAdmin}=permissionMw;

/* User to mentor*/
router.patch('/user/:userId',
  authorization,
  tokenVerify,
  isAdmin,
  AdminController.userToMentor);

export default router;