import {Router} from 'express'
import { getProfile, login, logout, register } from '../controllers/authController.js'
import {protect} from '../middleware/auth.js'

 const router = Router();

 router.post('/register', register);
 router.post('/login', login);
 router.post('/logout', logout);
 router.get('/profile', protect, getProfile);

 export default router;