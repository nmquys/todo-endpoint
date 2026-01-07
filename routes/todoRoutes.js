const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const todoController = require("../controllers/todoController");
const authMiddleware = require("../middleware/authMiddleware");
const validation = require("../middleware/validation");

router.use(authMiddleware);

router.get("/", authMiddleware, todoController.getTodos);
router.post(
  "/",
  [
    body("title", "tilte cannot be empty").exists(),
    body("description", "description cannot be empty").exists(),
  ],
  validation,
  todoController.createTodo,
);
router.put(
  "/:id",
  [
    body("title", "tilte cannot be empty").exists(),
    body("description", "description cannot be empty").exists(),
  ],
  authMiddleware,
  validation,
  todoController.updateTodo,
);
router.delete("/:id", authMiddleware, validation, todoController.deleteTodo);

module.exports = router;
