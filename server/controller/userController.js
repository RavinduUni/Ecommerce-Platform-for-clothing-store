import bcrypt from 'bcrypt';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import Cart from '../models/Cart.js';

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

        res.status(201).json({ success: true, message: "User registered successfully", user: newUser, token });
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
            return res.status(400).json({ success: false, message: "Cart not found" });
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
            return res.status(400).json({ success: false, message: "Cart not found" });
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
            return res.status(400).json({ success: false, message: "Cart not found" });
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