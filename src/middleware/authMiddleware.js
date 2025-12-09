import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    let token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ error: "Not authorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id };
        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid token" });
    }
};
