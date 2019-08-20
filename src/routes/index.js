import express from 'express';
import api from './api/';
const router = express.Router();

router.use('/api/v1', api);

router.use((err, req, res, next) => {
  if (err) {
    res.status(err.status || 500);
    return res.json({
      status: err.status,
      error: err.message,
    });
  }
  return next();
});


export default router;