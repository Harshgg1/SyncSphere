import { Router } from 'express';
import * as roomController from '../controllers/room.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();
router.use(authMiddleware);

router.post('/', roomController.createRoom);
router.get('/', roomController.getRooms);
router.get('/:roomId', roomController.getRoom);
router.post('/:roomId/join', roomController.joinRoom);
router.post('/:roomId/leave', roomController.leaveRoom);
router.delete('/:roomId', roomController.deleteRoom);
router.get('/:roomId/members', roomController.getRoomMembers);

export default router;
