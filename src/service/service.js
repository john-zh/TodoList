


let service = {
    init() {
        let todoListId = 0
        let todoId = 0
        let todoListIds = []
        let todoListDic = {}
        let todoDic = {}
        if (!localStorage.todoListId <= 0) {
            localStorage.setItem('todoListId', todoListId)
            localStorage.setItem('todoId', todoId)
            localStorage.setItem('todoListIds', JSON.stringify(todoListIds))
            localStorage.setItem('todoDic', JSON.stringify(todoDic))
            localStorage.setItem('todoListDic', JSON.stringify(todoListDic))
        }
    },
    getTodoLists() {
        let todoListIds = JSON.parse(localStorage.getItem('todoListIds'))
        let todoListDic = JSON.parse(localStorage.getItem('todoListDic'))
        let todoDic = JSON.parse(localStorage.getItem('todoDic'))
        let todoLists = []
        todoListIds.forEach((id) => {
            let todoList = todoListDic[id]
            let todos = []
            todoList.todos.forEach((todoId) => {
                todos.push(todoDic[todoId])
            })
            todoList.todos = todos
            todoLists.push(todoList)
        })
        return todoLists
    },
    addTodoList(todoList) {
        let todoListIds = JSON.parse(localStorage.getItem('todoListIds'))
        let todoListDic = JSON.parse(localStorage.getItem('todoListDic'))
        todoList.id = ++localStorage.todoListId
        todoListDic[todoList.id] = todoList
        todoListIds.push(todoList.id)
        localStorage.setItem('todoListIds', JSON.stringify(todoListIds))
        localStorage.setItem('todoListDic', JSON.stringify(todoListDic))
    },
    updateTodoList(todoList, id) {
        let todoListDic = JSON.parse(localStorage.getItem('todoListDic'))
        todoLisDic[id] = todoList
        localStorage.setItem('todoListDic', JSON.stringify(todoListDic))
    },
    deleteTodoList(id) {
        let todoListIds = JSON.parse(localStorage.getItem('todoListIds'))
        let todoListDic = JSON.parse(localStorage.getItem('todoListDic'))
        delete todoListDic[id]
        let index = todoListIds.findIndex((x) => {
            return x == id
        })
        todoListId.splice(index, 1)
        localStorage.setItem('todoListIds', JSON.stringify(todoListIds))
        localStorage.setItem('todoListDic', JSON.stringify(todoListDic))
    },
    updateTodos(todos, id) {
        let todoListDic = JSON.parse(localStorage.getItem('todoListDic'))
        let todoList = todoListDic[id]
        todoList.todos = todos
        console.log(JSON.stringify(todoListDic))
        localStorage.setItem('todoListDic', JSON.stringify(todoListDic))
    },
    addTodo(todo, id) {
        let todoListDic = JSON.parse(localStorage.getItem('todoListDic'))
        let todoDic = JSON.parse(localStorage.getItem('todoDic'))
        let todoList = todoListDic[id]
        let newId = ++localStorage.todoId
        todo.id = newId
        todoDic[newId] = todo
        console.log(id, JSON.stringify(todoListDic),JSON.stringify(todoList))
        todoList.todos.push(newId)
        localStorage.setItem('todoListDic', JSON.stringify(todoListDic))
        localStorage.setItem('todoDic', JSON.stringify(todoDic))
    },
    updateTodo(todo) {
        let todoDic = JSON.parse(localStorage.getItem('todoDic'))
        todoDic[todo.id] = todo
        localStorage.setItem('todoDic', JSON.stringify(todoDic))
    },
    deleteTodo(todoId, id) {
        let todoListDic = JSON.parse(localStorage.getItem('todoListDic'))
        let todoDic = JSON.parse(localStorage.getItem('todoDic'))
        let todoList = todoListDic[id]
        delete todoDic[todoId]
        let index = todoList.todos.findIndex((x) => {
            return x == todoId
        })
        todoList.todos.splice(index, 1)
    }
}

export default service;