import bcrypt from 'bcrypt';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

export const registerUser = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: "Passwords do not match" });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        const token = generateToken(newUser._id, 'user');

        res.status(201).json({ success: true, message: "User registered successfully", token });
    } catch (error) {
        res.status(500).json({ success: false, message: "Registration failed", error: error.message });
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Missing email or password" });
        }
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        const token = generateToken(user._id, 'user');

        res.status(200).json({ success: true, message: "Login successful", user, token });
    } catch (error) {
        res.status(500).json({ success: false, message: "Login failed", error: error.message });
    }
}


export const addToCart = async (req, res) => {
    try {
        const userId = req.user._id;

        const { productId, size, quantity } = req.body;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const existingItem = cart.items.find(
            item => item.productId.toString() === productId && item.size === size
        )

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ productId, size, quantity });
        }
        await cart.save();

        res.status(200).json({ success: true, message: "Product added to cart", cart });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to add product to cart", error: error.message });
    }
}


export const getCart = async (req, res) => {
    try {
        const userId = req.user._id;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(400).json({ success: false, message: "Add items to cart" });
        }

        res.status(200).json({ success: true, cart });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to get cart", error: error.message });
    }
}

export const removeFromCart = async (req, res) => {
    try {
        const userId = req.user._id;

        const { productId, size } = req.body;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(400).json({ success: false, message: "Add items to cart" });
        }
        cart.items = cart.items.filter(
            item => !(item.productId.toString() === productId && item.size === size)
        );

        await cart.save();

        res.status(200).json({ success: true, message: "Product removed from cart", cart });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to remove product from cart", error: error.message });
    }
}

export const updateCart = async (req, res) => {
    try {
        const userId = req.user._id;

        const { productId, size, quantity } = req.body;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(400).json({ success: false, message: "Add items to cart" });
        }

        const item = cart.items.find(
            item => item.productId.toString() === productId && item.size === size
        );
        if (!item) {
            return res.status(400).json({ success: false, message: "Item not found in cart" });
        }

        item.quantity = quantity;

        await cart.save();

        res.status(200).json({ success: true, message: "Cart updated successfully", cart });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update cart", error: error.message });
    }
}

export const createOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        const { items, shippingAddress, paymentMethod, paymentDetails, pricing } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: "No items to place order" });
        }

        let orderItems = [];
        let subtotal = 0;

        // 1. Recalculate everything from DB
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(400).json({ success: false, message: `Product not found: ${item.productId}` });
            }

            const price = product.price;
            const totalItemPrice = price * item.quantity;

            subtotal += totalItemPrice;

            orderItems.push({
                productId: product._id,
                name: product.name,
                image: product.images[0],
                price: price,
                quantity: item.quantity,
                size: item.size
            })
        }

        // 2. Calculate fees
        const tax = subtotal * 0.08;
        const shipping = subtotal > 100 ? 0 : 15;
        const total = subtotal + tax + shipping;

        const finalPricing = {
            subtotal,
            tax,
            shipping,
            discount: 0,
            total
        };

        const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const order = await Order.create({
            orderNumber,
            userId,
            items: orderItems,
            shippingAddress,
            paymentMethod,
            paymentDetails,
            pricing: finalPricing,
            timeline: [{
                status: 'placed',
                timestamp: new Date(),
                note: 'Order has been placed successfully'
            }]
        });

        // Clear cart after order
        await Cart.findOneAndUpdate({ userId }, { items: [] });

        res.status(201).json({ success: true, message: "Order created successfully", order });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to create order", error: error.message });
    }
}

export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user._id;
        const orders = await Order.find({ userId }).sort({ createdAt: -1 });
        
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch orders", error: error.message });
    }
}

export const getOrderById = async (req, res) => {
    try {
        const userId = req.user._id;
        const { orderId } = req.params;

        const order = await Order.findOne({ _id: orderId, userId });

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch order", error: error.message });
    }
}