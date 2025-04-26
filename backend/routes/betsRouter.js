import Router from 'express';
import {
    betsPagePost,
//   betPageGet,
//   betPost,
//   betDelete,
//   betUpdate,
} from '../controllers/betsController.js';
import { verifyToken } from './utils.js';
const betsRouter = Router();

betsRouter.post('/:taskId', verifyToken, betsPagePost);

export default betsRouter;