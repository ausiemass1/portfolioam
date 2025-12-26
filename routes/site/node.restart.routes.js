import express from 'express';
const router = express.Router();
import nodeRestart from '../../controllers/site/node.restart.controller.js';


router.post("/", nodeRestart)


export default router;