const express = require("express");
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require("../controllers/userControllers");
const { check, validationResult } = require("express-validator");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

router.post("/register", [
    check("email").isEmail(),
    check("password").isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    await registerUser(req, res);
});

router.post("/login", async (req, res) => await loginUser(req, res));

router.get("/profile", authMiddleware, getUserProfile);

router.put("/profile", authMiddleware, updateUserProfile);

module.exports = router;
