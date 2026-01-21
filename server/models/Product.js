import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    sku: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    discountPrice: {
        type: Number,
    },
    category: {
        type: String,
        required: true,
    },
    images: {
        type: [String],
        required: true,
    },
    availableSizes: [
        {
            size: { type: String, required: true }, // S, M, L
            qty: { type: Number, required: true }   // stock quantity
        }
    ]

});

const Product = mongoose.model("Product", productSchema);

export default Product;