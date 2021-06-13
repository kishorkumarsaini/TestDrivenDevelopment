const TodoController = require('../../controller/todo.controller');
const TodoModel = require('../../models/todo.model')
const httpMocks = require('node-mocks-http');
const newTodo = require('../mock-data/new-todo.json');
const getAllTodo = require('../mock-data/get-all-todo.json');

//check create method will be called in test 
TodoModel.create = jest.fn();
TodoModel.find = jest.fn();
TodoModel.findById = jest.fn();
TodoModel.findByIdAndUpdate = jest.fn();
TodoModel.findByIdAndDelete = jest.fn();

//jest.mock('../../models/todo.model.js');

let todoId = '6088fa2a9f905789181c7b6b';
let req, res, next;
beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();

});

describe("TodoController.deleteTodo", () => {
    it("should be deleteTodo", () => {
        expect(typeof TodoController.deleteTodo).toBe('function');

    })
    it("should be findByIdAndDelete is called", async() => {
        req.params.todoId = todoId;
        await TodoController.deleteTodo(req, res, next);
        expect(TodoModel.findByIdAndDelete).toBeCalledWith(todoId);
    })
    it("should have statusCode 200 and deleteData", async() => {
        TodoModel.findByIdAndDelete.mockReturnValue(newTodo);
        await TodoController.deleteTodo(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(newTodo);

    });
    it("should handle error", async() => {
        const errorMessage = { message: "Error with delete todo" }
        const rejectedPromise = Promise.reject(errorMessage);
        TodoModel.findByIdAndDelete.mockReturnValue(rejectedPromise);
        await TodoController.deleteTodo(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    });
    it("should handle 404", async() => {
        TodoModel.findByIdAndDelete.mockReturnValue(null);
        await TodoController.deleteTodo(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    })

})

describe("TodoController.updateTodo", () => {
    it("should have the updateTodo function", () => {
        expect(typeof TodoController.updateTodo).toBe('function');
    });
    it("should update with TodoModel.findByIdAndUpdate", async() => {
        req.params.todoId = todoId;
        req.body = newTodo;
        await TodoController.updateTodo(req, res, next);
        expect(TodoModel.findByIdAndUpdate).toHaveBeenCalledWith(todoId, newTodo, {
            new: true,
            useFindAndModify: false
        });

    });
    it("should return status 200 and json data", async() => {
        req.params.todoId = todoId;
        req.body = newTodo;
        TodoModel.findByIdAndUpdate.mockReturnValue(newTodo);
        await TodoController.updateTodo(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(newTodo);

    });
    it("should handle Error", async() => {
        const errorMessage = "Failed with update";
        const rejectedPromise = Promise.reject(errorMessage);
        TodoModel.findByIdAndUpdate.mockReturnValue(rejectedPromise);
        await TodoController.updateTodo(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    });
    it("should handle 404", async() => {
        TodoModel.findByIdAndUpdate.mockReturnValue(null);
        await TodoController.updateTodo(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    })
});

describe("TodoController.getTodoById", () => {
    it("should have the getTodoById function", () => {
        expect(typeof TodoController.getTodoById).toBe('function');
    });
    it("should be have TodoModel.findById with routes params", async() => {
        req.params.todoId = todoId;
        await TodoController.getTodoById(req, res, next);
        expect(TodoModel.findById).toBeCalledWith(todoId);
    })
    it("should be have status code 200 and all todos", async() => {
        TodoModel.findById.mockReturnValue(newTodo);
        await TodoController.getTodoById(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(newTodo);
    })
    it("should do error handling", async() => {
        const errorMessage = { message: 'Error in todoFindById' };
        const rejectedPromise = Promise.reject(errorMessage);
        TodoModel.findById.mockReturnValue(rejectedPromise);
        await TodoController.getTodoById(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    });
    it("should be have status code 404 and item does not exist", async() => {
        TodoModel.findById.mockReturnValue(null);
        await TodoController.getTodoById(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    })
})

describe("TodoController.getTodos", () => {

    it("should have the get function", () => {
        expect(typeof TodoController.getTodos).toBe("function");
    })
    it("should call the Todomodel.find", async() => {
        await TodoController.getTodos(req, res, next);
        expect(TodoModel.find).toBeCalledWith({});

    })
    it("should return response with status 200 and all todos", async() => {
        TodoModel.find.mockReturnValue(getAllTodo);
        await TodoController.getTodos(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy(); // check response is get
        expect(res._getJSONData()).toStrictEqual(getAllTodo);
    })
    it("should handle error", async() => {
        const errorMessage = { message: "Error in finding" };
        const rejectedPromise = Promise.reject(errorMessage);
        TodoModel.find.mockReturnValue(rejectedPromise);
        await TodoController.getTodos(req, res, next);
        expect(next).toBeCalledWith(errorMessage);

    })
})

describe("TodoController.createTodo", () => {

    beforeEach(() => {
        req.body = newTodo;

    })

    it('should have a create function', () => {
        expect(typeof TodoController.createTodo).toBe("function");
    });

    it('Should be called TodoModel.create', () => {
        TodoController.createTodo(req, res, next);
        expect(TodoModel.create).toBeCalledWith(newTodo);

    });
    it("should return 201 response code", async() => {
        await TodoController.createTodo(req, res, next);
        expect(res.statusCode).toBe(201);
        expect(res._isEndCalled()).toBeTruthy(); //for check the send response

    });
    it("should be return json body response", async() => {
        TodoModel.create.mockReturnValue(newTodo);
        await TodoController.createTodo(req, res, next);
        expect(res._getJSONData()).toStrictEqual(newTodo);
    })
    it("should handle error", async() => {
        const errorMessage = { message: 'Done property required' };
        const rejectedPromise = Promise.reject(errorMessage);
        TodoModel.create.mockReturnValue(rejectedPromise);
        await TodoController.createTodo(req, res, next);
        expect(next).toBeCalledWith(errorMessage);

    })
})