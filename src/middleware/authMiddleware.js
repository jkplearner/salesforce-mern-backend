import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    let token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ error: "Not authorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        if (!user) return res.status(401).json({ error: "User not found" });
        req.user = { id: user._id, email: user.email };
        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid token" });
    }
};
