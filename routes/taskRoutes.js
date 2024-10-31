const express = require("express");
const { createTask, getTasks, updateTask, deleteTask } = require("../controllers/taskControllers");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

router.post("/", authMiddleware, createTask);
router.get("/", authMiddleware, getTasks);
router.put("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);

module.exports = router;
