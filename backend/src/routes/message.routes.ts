import { Router } from 'express';
import * as messageController from '../controllers/message.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();
router.use(authMiddleware);

router.get('/:roomId/pinned', messageController.getPinnedMessages);
router.get('/:roomId', messageController.getMessages);
router.put('/:messageId', messageController.editMessage);
router.delete('/:messageId', messageController.deleteMessage);

export default router;
