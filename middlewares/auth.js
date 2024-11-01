const jwt = require("jsonwebtoken");

const tokenBlacklist = new Set();

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token || tokenBlacklist.has(token)) return res.status(401).json({ message: "Access denied" });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userId = verified.userId;
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid token" });
    }
};

const addToBlackList = (req, res) => {
    const token = req.headers["authorization"].split(" ")[1];
    tokenBlacklist.add(token);
    res.status(200).json({ message: "Logged out successfully" });
}

module.exports = {authMiddleware, addToBlackList};