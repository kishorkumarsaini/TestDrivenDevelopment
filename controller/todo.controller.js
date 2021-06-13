const TodoModel = require('../models/todo.model');
exports.createTodo = async(req, res, next) => {
    try {
        const todoResponse = await TodoModel.create(req.body);
        res.status(201).json(todoResponse);

    } catch (err) {
        next(err);
    }

}
exports.getTodos = async(req, res, next) => {
    try {
        const todoList = await TodoModel.find({});
        res.status(200).json(todoList);
    } catch (err) {
        next(err);
    }
}
exports.getTodoById = async(req, res, next) => {
    try {
        const todo = await TodoModel.findById(req.params.todoId);
        if (todo) {
            res.status(200).json(todo);
        } else {
            res.status(404).json();
        }


    } catch (err) {
        next(err);
    }
}

exports.updateTodo = async(req, res, next) => {
    try {
        const updateTodo = await TodoModel.findByIdAndUpdate(req.params.todoId, req.body, { new: true, useFindAndModify: false });
        if (updateTodo) {
            res.status(200).json(updateTodo);
        } else {
            res.status(404).send();
        }

    } catch (error) {
        next(error);
    }

}

exports.deleteTodo = async(req, res, next) => {
    try {
        const deleteTodo = await TodoModel.findByIdAndDelete(req.params.todoId);
        if (deleteTodo) {
            res.status(200).json(deleteTodo);
        } else {
            res.status(404).send();
        }

    } catch (error) {
        next(error);
    }
}