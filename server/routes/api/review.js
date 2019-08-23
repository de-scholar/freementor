import express from 'express';
import sessionValidation from '../../middleware/sessionValidation';
import permissionMw from '../../middleware/permission';
import validate from '../../middleware/validate';
import ReviewController from '../../controllers/ReviewController';
import bodyParser from 'body-parser';
import AuthMw from '../../middleware/auth';

const router = express.Router();
const urlEncodedParser=bodyParser.urlencoded({extended:false});
const {authorization,tokenVerify}=AuthMw;
const {isAdmin}=permissionMw;



/* review a mentor*/
router.post('/sessions/:sessionId/review',
  urlEncodedParser,
  authorization,
  tokenVerify,
  sessionValidation.onReview,
  validate,
  ReviewController.review_mentor);

/* admin can delete a review*/
router.delete('/sessions/:sessionId/review',
  authorization,
  tokenVerify,
  isAdmin,
  ReviewController.delete);



export default router;