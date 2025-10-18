import { Router } from 'express'
import { login, register, getProfile } from '../controllers/authController.js'
import { authenticateToken, requireRole } from '../middleware/auth.js'

const router = Router()

// Public routes
router.post('/login', login)

// Protected routes
router.post('/register', authenticateToken, requireRole(['admin']), register)
router.get('/profile', authenticateToken, getProfile)

export default router
