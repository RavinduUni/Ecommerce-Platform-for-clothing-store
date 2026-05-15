import { Router } from "express";
import { adminLogin, adminRegister, getUserOrders } from "../controller/adminController.js";

const adminRouter = Router();

adminRouter.post('/login', adminLogin);
adminRouter.post('/register', adminRegister);
adminRouter.get('/orders', getUserOrders);

export default adminRouter;