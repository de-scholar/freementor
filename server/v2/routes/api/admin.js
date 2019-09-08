import express from 'express';
import permissionMw from '../../middleware/permission';
import AdminController from '../../controllers/AdminController';
import AuthMw from '../../middleware/auth';

const router = express.Router();
const { authorization, tokenVerify } = AuthMw;
const { isAdmin } = permissionMw;


router.patch('/admin/:userId',
  authorization,
  tokenVerify,
  AdminController.userToAdmin);


router.patch('/admin-to/:userId/',
  authorization,
  tokenVerify,
  isAdmin,
  AdminController.adminToUser);


router.patch('/user/:userId',
  authorization,
  tokenVerify,
  isAdmin,
  AdminController.userToMentor);

router.patch('/mentor/:userId',
  authorization,
  tokenVerify,
  isAdmin,
  AdminController.mentorToUser);


export default router;
