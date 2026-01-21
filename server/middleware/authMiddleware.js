import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectedRoute = async (req, res, next) => {
    try {
        
        const token = req.headers.authorization.split(" ")[1];

        if (!token) {
            return res.status(401).json({ success: false, message: "Please log in" });
        }

        const isExpired = jwt.decode(token).exp * 1000 < Date.now();
        if (isExpired) {
            return res.status(401).json({ success: false, message: "Token expired" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id).select("-password");
        next();

    } catch (error) {
        res.status(401).json({ success: false, message: "Unauthorized" });
    }
}