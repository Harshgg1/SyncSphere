import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', authMiddleware, authController.getMe);
router.get('/token', authMiddleware, authController.getToken);

export default router;
