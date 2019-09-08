import express from 'express';

import api from './api/index';

const router = express.Router();

router.use('/api/v2', api);


export default router;
