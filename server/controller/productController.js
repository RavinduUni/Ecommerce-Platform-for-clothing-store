import Product from "../models/Product.js";
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

export const addProduct = async (req, res) => {
    
    try {
        const { name, sku, category, description, originalPrice, discountedPrice, sizes } = req.body;

        const parsedSizes = JSON.parse(sizes).map(s => ({
            size: s.size,
            qty: s.stock
        }));

        const imageUrls = await Promise.all(
            req.files.map(async (file) => {
                const url = await cloudinary.uploader.upload(file.path, {
                    folder: 'ecommerce/products'
                });
                fs.unlinkSync(file.path); // Remove file from server after upload
                return url.secure_url;
            })
        );

        const newProduct = await Product.create({
            name,
            sku,
            category,
            description,
            price: originalPrice,
            discountPrice: discountedPrice,
            images: imageUrls,
            availableSizes: parsedSizes
        });

        console.log(newProduct);
        

        res.status(201).json({success: true, message: "Product added successfully", product: newProduct });

    } catch (error) {
        res.status(500).json({success: false, message: "Server error", error: error.message });
    }

}


export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({success: true, products });

    } catch (error) {
        res.status(500).json({success: false, message: "Server error", error: error.message });
    }
}