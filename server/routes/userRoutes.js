import { Router } from "express";
import { addToCart, createOrder, getCart, getOrderById, getUserOrders, getUserProfile, loginUser, registerUser, removeFromCart, updateCart } from "../controller/userController.js";
import { protectedRoute } from "../middleware/authMiddleware.js";

const userRouter = Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/profile', protectedRoute, getUserProfile);

userRouter.post('/add-to-cart', protectedRoute, addToCart);
userRouter.get('/cart', protectedRoute, getCart);
userRouter.post('/update-cart', protectedRoute, updateCart);
userRouter.post('/remove-from-cart', protectedRoute, removeFromCart);

userRouter.post('/orders', protectedRoute, createOrder);
userRouter.get('/orders', protectedRoute, getUserOrders);
userRouter.get('/orders/:orderId', protectedRoute, getOrderById);

export default userRouter;