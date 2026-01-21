import Admin from "../models/Admin";
import jwt from "jsonwebtoken";

export const verifyAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];

        if (!token) {
            return res.status(401).json({ success: false, message: "Please log in as admin" });
        }

        const isExpired = jwt.decode(token).exp * 1000 < Date.now();
        if (isExpired) {
            return res.status(401).json({ success: false, message: "Token expired" });
        }

        const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);

        if (decoded.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Access denied, admin only" });
        }

        const admin = await Admin.findById(decoded.id).select("-password");
        if (!admin) {
            return res.status(401).json({ success: false, message: "Unauthorized admin" });
        }

        req.admin = admin;
        next();

    } catch (error) {
        return res.status(401).json({ success: false, message: "Unauthorized admin route" });
    }
}