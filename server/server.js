import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/database.js';
import userRouter from './routes/userRoutes.js';
import productRouter from './routes/productRoute.js';
import connectCloudinary from './config/cloudinary.js';

//Initialize server
const app = express();

const PORT = process.env.PORT || 5000;

//Database connection
await connectDB();
await connectCloudinary();

//Middlewares
app.use(cors());
app.use(express.json());

//Routes
app.get('/', (req, res) => res.json({message: "API is running"}));
app.use('/api/users', userRouter);
app.use('/api/products', productRouter)


app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})
