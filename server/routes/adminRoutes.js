import { Router } from "express";
import { adminLogin, adminLogout, adminRegister } from "../controller/adminController.js";

const adminRouter = Router();

adminRouter.post('/login', adminLogin);
adminRouter.post('/logout', adminLogout);
adminRouter.post('/register', adminRegister);

export default adminRouter;