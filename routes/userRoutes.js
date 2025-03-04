import express from 'express'
import { loginUser, registerUser, adminLogin, userProfile, getUserData } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.put("/profile", authMiddleware, userProfile);
userRouter.get("/profile",authMiddleware, getUserData);
userRouter.post("/admin", adminLogin);

export default userRouter;