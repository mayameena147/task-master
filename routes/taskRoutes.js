const express = require("express");
const { createTask, getTasks, updateTask, deleteTask, 
assignTask, addCommentOnTask, addAttachmentOnTask, markTaskAsCompleted } = require("../controllers/taskControllers");
const {authMiddleware} = require("../middlewares/auth");

const router = express.Router();

router.post("/", authMiddleware, createTask);
router.get("/", authMiddleware, getTasks);
router.put("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);
router.post("/:id/comment", authMiddleware, addCommentOnTask);
router.post("/:id/attachment", authMiddleware, addAttachmentOnTask);
router.put("/:taskId/:assignedUserId", authMiddleware, assignTask);
router.put("/:id/complete", authMiddleware, markTaskAsCompleted);

module.exports = router;
