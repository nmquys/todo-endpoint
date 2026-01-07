const Todo = require("../schema/todoSchema");

const getTodos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const todos = await Todo.find({ userId: rq.userId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Todo.countDocuments({ userId: req.userId });

    res.json({
      data: todos,
      page,
      limit,
      total,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createTodo = async (req, res) => {
  try {
    const { title, description } = req.body;

    const todo = new Todo({
      title,
      description,
      userId: req.userId,
    });

    await todo.save();

    res.status(201).json(todo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const todo = await Todo.findOne({
      _id: id,
      userId: req.userId,
    });

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    if (title) todo.title = title;
    if (description) todo.description = description;
    if (completed) todo.completed = completed;

    await todo.save();

    res.json(todo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};
