import { Router } from "express";
import { addToCart, getCart, loginUser, registerUser, removeFromCart, updateCart } from "../controller/userController.js";
import { protectedRoute } from "../middleware/authMiddleware.js";

const userRouter = Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

userRouter.post('/add-to-cart', protectedRoute, addToCart);
userRouter.get('/cart', protectedRoute, getCart);
userRouter.post('/update-cart', protectedRoute, updateCart);
userRouter.post('/remove-from-cart', protectedRoute, removeFromCart);

export default userRouter;