<template>
<div id="example">
    <div class="body">
        <div class="raw" v-for="(todoList, index) in todoLists" :key="index">
            <div class="box">
                <div class="box-title">
                    <span>{{todoList.title}}</span>
                    <Icon class="icon1" type="ios-arrow-down"></Icon>
                </div>
                <div>
                    <todo-list :todo-index="index" :data="todoList.todos" :add-todo="doAddTodo" :update-todo="doUpdateTodo"></todo-list>
                </div>
            </div>
        </div>
        <div class="raw">
            <div class="box">
                <Button type="text" icon="plus-round" v-if="!newTodoList.isAdding" @click="addTodoList" id="newItem">
                    新建列表
                </Button>
                <div v-if="newTodoList.isAdding">
                    <Input v-model="newTodoList.title"></Input>
                    <div class="button-group">
                        <Button type="primary" @click="doAddTodoList">确定</Button>
                        <Button @click="newTodoList.isAdding = false">取消</Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import TodoList from "./TodoList";
export default {
    name: 'example',
    components: {
        TodoList
    },
    data() {
        return {
            newTodoList: {
                isAdding: false,
                title: '',
            },
            todoLists: [{
                title: '要做',
                percent: 0,
                todos: []
            }]
        }
    },
    mounted() {
        if (localStorage.todoLists) {
            console.log(localStorage.todoLists)
            this.todoLists = JSON.parse(localStorage.getItem('todoLists'))
        } else {
            localStorage.setItem("todoLists", JSON.stringify(this.todoLists))
        }
    },
    methods: {
        addTodoList() {
            this.newTodoList.isAdding = true
        },
        doAddTodoList() {
            let data = {
                title: this.newTodoList.title,
                percent: 0,
                todos: []
            }
            this.todoLists.push(data)
            this.newTodoList.isAdding = false
        },
        doAddTodo(todo, index) {
            this.todoLists[index].todos.push(todo)
            localStorage.todoLists = JSON.stringify(this.todoLists)
        },
        doUpdateTodo(todo, index) {
            console.log(todo)
            this.todoLists[index].todos = todo
            localStorage.todoLists = JSON.stringify(this.todoLists)
        }

    }
}
</script>