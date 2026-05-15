import { Router } from "express";
import { addProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from "../controller/productController.js";
import upload from "../middleware/multer.js";
import { verifyAdmin } from "../middleware/adminVerify.js";


const productRouter = Router();

productRouter.post('/add',verifyAdmin, upload.array('images', 3), addProduct);
productRouter.get('/all', getAllProducts);
productRouter.get('/:id', getProductById);
productRouter.delete('/:id', verifyAdmin, deleteProduct);
productRouter.put('/update/:id', verifyAdmin, upload.array('images', 3), updateProduct);

export default productRouter;