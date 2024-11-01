const express = require("express");
const { createTeam, inviteMember } = require("../controllers/teamControllers");
const {authMiddleware} = require("../middlewares/auth");

const router = express.Router();

router.post("/create", authMiddleware, createTeam);
router.post("/invite", authMiddleware, inviteMember);

module.exports = router;
