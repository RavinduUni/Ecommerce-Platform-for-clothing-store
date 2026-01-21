import Admin from "../models/Admin.js";
import bcrypt from "bcrypt";
import { generateAdminToken } from "../utils/generateToken.js";

export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(404).json({ message: "Invalid admin credentials" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.status(404).json({ message: "Invalid admin credentials" });
        }

        const token = generateAdminToken(admin._id);

        res.status(200).json({
            token,
        });
    } catch (error) {
        res.status(500).json({ message: "Admin login failed" });
    }
}


export const adminRegister = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, adminCode } = req.body;

        if (!name || !email || !password || !confirmPassword || !adminCode) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        if (adminCode !== process.env.ADMIN_SECRET_CODE) {
            return res.status(403).json({ message: "Invalid admin registration code" });
        }

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(409).json({ message: "Admin with this email already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = await Admin.create({
            name,
            email,
            password: hashedPassword,
        });

        const token = generateAdminToken(newAdmin._id);

        res.status(201).json({
            token,
        });

    } catch (error) {
        res.status(500).json({ message: "Admin registration failed" });
    }
}
