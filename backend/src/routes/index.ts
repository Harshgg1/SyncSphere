import { Router } from 'express';
import authRoutes from './auth.routes.js';
import roomRoutes from './room.routes.js';
import messageRoutes from './message.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/rooms', roomRoutes);
router.use('/messages', messageRoutes);

export { authRoutes, roomRoutes, messageRoutes };
export default router;
