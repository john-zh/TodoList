<template>
<div id="todoList">
    <div class="progress">
        <Progress :percent="percent">
            <span>{{todoDone}}/{{todoNum}}</span>
        </Progress>
    </div>
    <div v-for="(todo, index) of todoList" :key="index" class="todo-list">
        <Card shadow>
            <div class="card-content">
                <div class="check-box">
                    <Checkbox v-model="todo.selected" @on-change="doUpdateTodo(todoList, todoIndex)">
                        <span></span>
                    </Checkbox>
                </div>
                <div class="todo-content">
                    <span :class="{done: todo.selected}">{{todo.content}}</span>
                    <div class="deadline" v-if="todo.endTime">
                        <Icon type="clock"></Icon>
                        {{todo.endTime}}
                        <span>截止</span>
                    </div>
                </div>
            </div>
        </Card>
    </div>
    <div>
        <Button type="text" icon="plus-round" v-if="!newTodo.isAdding" @click="newTodo.isAdding = true" style="margin-left: -10px;">
            添加新任务
        </Button>
        <div v-if="newTodo.isAdding" class="add-new-todo" @keyup.enter="preAddTodo">
            <Input v-model="newTodo.content" type="textarea"></Input>
            <div class="bottom-content">
                <DatePicker :open="newTodo.open" :value="newTodo.endTime" confirm type="date" @on-change="handleChange">
                    <a href="javascript:void(0)" @click="newTodo.open = !newTodo.open">
                        <Icon type="ios-calendar-outline"></Icon>
                        <span v-if="!newTodo.endTime">选择截止日期</span>
                        <span v-else>{{newTodo.endTime}}</span>
                    </a>
                </DatePicker>
            </div>
            <div class="button-group">
                <Button type="primary" @click="preAddTodo">确定</Button>
                <Button @click="newTodo.isAdding = false">取消</Button>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    name: 'todoList',
    props: ['data', 'todoIndex', 'addTodo', 'updateTodo'],
    data() {
        return {
            newTodo: {
                isAdding: false,
                content: '',
                endTime: '',
                open: false
            }
        }
    },
    mounted() {
    },
    computed: {
        doAddTodo() {
            return this.addTodo || (() => {})
        },
        doUpdateTodo() {
            return this.updateTodo || (() => {})
        },
        todoDone() {
            let todoDone = 0
            this.todoList.forEach((item) => {
                if (item.selected) {
                    todoDone += 1
                }
            })
            return todoDone
        },
        todoList() {
            return this.data || []
        },
        todoNum() {
            return this.todoList.length
        },
        percent() {
            if (this.todoNum == 0)
                return
            return (this.todoDone / this.todoNum).toFixed(2) * 100
        }
    },
    methods: {
        preAddTodo() {
            let data = {
                content: this.newTodo.content,
                selected: false,
                endTime: this.newTodo.endTime,
            }
            this.doAddTodo(data, this.todoIndex)
            this.newTodo.isAdding = false
            this.resetNewTodo()
        },
        resetNewTodo() {
            this.newTodo = {
                isAdding: false,
                content: '',
                endTime: '',
                open: false
            }
        },
        handleChange(value) {
            this.newTodo.endTime = value
            this.newTodo.open = false;
        }
    }
}
</script>