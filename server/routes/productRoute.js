import { Router } from "express";
import { addProduct, getAllProducts } from "../controller/productController.js";
import upload from "../middleware/multer.js";

const productRouter = Router();

productRouter.post('/add', upload.array('images', 3), addProduct);
productRouter.get('/all', getAllProducts);

export default productRouter;