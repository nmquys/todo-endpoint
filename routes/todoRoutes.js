const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const todoController = require("../controllers/todoController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.get("/", authMiddleware, todoController.getTodos);
router.post(
  "/",
  [
    body("title", "tilte cannot be empty").exists(),
    body("description", "description cannot be empty").exists(),
  ],
  todoController.createTodo,
);
router.put(
  "/:id",
  [
    body("title", "tilte cannot be empty").exists(),
    body("description", "description cannot be empty").exists(),
  ],
  authMiddleware,
  todoController.updateTodo,
);
router.delete("/:id", authMiddleware, todoController.deleteTodo);

module.exports = router;
