import { Router } from "express";
import { adminLogin, adminRegister } from "../controller/adminController.js";

const adminRouter = Router();

adminRouter.post('/login', adminLogin);
adminRouter.post('/register', adminRegister);

export default adminRouter;