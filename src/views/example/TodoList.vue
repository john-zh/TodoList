<template>
<div id="todoList">
    <div class="progress">
        <Progress :percent="percent">
            <span>{{todoDone}}/{{todoNum}}</span>
        </Progress>
    </div>
    <!-- <transition-group name="flip-list" tag="div"> -->
    <div v-for="(todo, index) of todoList" :key="index" :id="`${todoIndex}-${index}`" class="todo-list" draggable="true" @dragstart="dragstart($event)" @dragleave="dragleave($event)" @dragenter="dragenter($event)" @dragend="dragend($event)">
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
    <!-- </transition-group> -->
    <div>
        <Button type="text" icon="plus-round" v-if="!newTodo.isAdding" @click="addNewTodo" style="margin-left: -10px;">
            添加新任务
        </Button>
        <div v-if="newTodo.isAdding" class="add-new-todo" @keyup.enter="preAddTodo">
            <Input :ref="`input_${this.todoIndex}`" v-model="newTodo.content" type="textarea"></Input>
            <div class="bottom-content">
                <DatePicker :open="newTodo.open" :value="newTodo.endTime" confirm type="date" @on-change="handleChange">
                    <a @click="newTodo.open = !newTodo.open">
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
    props: ['data', 'todoIndex', 'addTodo', 'updateTodo', 'inputFocus'],
    data() {
        return {
            newTodo: {
                isAdding: false,
                content: '',
                endTime: '',
                open: false
            },
            currentDoms: [],
            currentDom: {},
            targetDom: {},
            currentTop: '',
        }
    },
    computed: {
        doAddTodo() {
            return this.addTodo || (() => {})
        },
        doUpdateTodo() {
            return this.updateTodo || (() => {})
        },
        letInputFocus() {
            return this.inputFocus || (() => {})
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
        addNewTodo() {
            this.newTodo.isAdding = true
            this.$nextTick(function() {
                this.$refs[`input_${this.todoIndex}`].focus()
            })
        },
        preAddTodo() {
            let data = {
                content: this.newTodo.content,
                selected: false,
                endTime: this.newTodo.endTime,
            }
            let todoLists = JSON.parse(localStorage.getItem('todoLists'))
            this.todoList.push(data)
            todoLists[this.todoIndex].todos.push(data)
            localStorage.setItem("todoLists", JSON.stringify(todoLists))
            // this.addTodo(data, this.todoIndex)
            this.resetNewTodo()
        },
        resetNewTodo() {
            this.newTodo.content = ''
            this.newTodo.endTime = ''
            this.newTodo.open = false
        },
        handleChange(value) {
            this.newTodo.endTime = value
            this.newTodo.open = false;
        },
        isBeside(ev) {
            let currentIndex = 0,
                targetIndex = 0
            let flag = false
            let middleDoms = []
            let isCurrentDomIn = false
            for (let index in this.currentDoms) {
                let item = this.currentDoms[index]
                if (item == global.currentDom) {
                    isCurrentDomIn = true
                    currentIndex = parseInt(index)
                } else if (item == ev.currentTarget) {
                    targetIndex = parseInt(index)
                }
            }
            if (!isCurrentDomIn) {
                return {
                    flag: flag,
                    middleDoms: middleDoms,
                    trans: true
                }
            }
            if (currentIndex == targetIndex + 1 || currentIndex == targetIndex - 1) {
                flag = true
            } else {
                if (currentIndex < targetIndex) {
                    for (let i = currentIndex + 1; i <= targetIndex; i++) {
                        middleDoms.push(this.currentDoms[i])
                    }
                } else {
                    for (let i = currentIndex - 1; i >= targetIndex; i--) {
                        middleDoms.push(this.currentDoms[i])
                    }
                }
            }
            return {
                trans: false,
                flag: flag,
                middleDoms: middleDoms
            }
        },
        getMiddleDoms() {

        },
        dragstart(ev) {
            if (global.currentDom != ev.currentTarget) {
                this.tempList = []
                this.todoList.forEach((item, index) => {
                    let data = JSON.parse(JSON.stringify(item))
                    data.id = `${this.todoIndex}-${index}`
                    this.tempList.push(data)
                })
                global.currentDom = ev.currentTarget
                this.currentTop = ev.y
                global.currentDom.className = 'todo-list-none'
            }
        },
        dragenter(ev) {
            ev.preventDefault()
            // global.currentDom.className = 'todo-list-none'
            if (global.targetDom != ev.currentTarget) {
                global.targetDom = ev.currentTarget
            }
            if (global.currentDom != ev.currentTarget) {
                console.log('enter', ev.currentTarget.innerText)
                let entries = Object.entries(ev.currentTarget.parentNode.children)
                for (const [key, value] of entries) {
                    if (value.id != '') {
                        this.currentDoms.push(value)
                    }
                }
                let result = this.isBeside(ev)
                if (result.flag) {
                    if (this.currentTop < ev.y) {
                        ev.currentTarget.parentNode.insertBefore(ev.currentTarget, global.currentDom)
                    } else {
                        ev.currentTarget.parentNode.insertBefore(global.currentDom, ev.currentTarget)
                    }
                } else if (result.trans) {
                    global.currentDom.parentNode.removeChild(global.currentDom)
                    ev.currentTarget.parentNode.insertBefore(global.currentDom, ev.currentTarget)
                } else {
                    let doms = result.middleDoms
                    if (this.currentTop < ev.y) {
                        doms.forEach((dom) => {
                            ev.currentTarget.parentNode.insertBefore(dom, global.currentDom)
                        })
                    } else {
                        doms.forEach((dom) => {
                            ev.currentTarget.parentNode.insertBefore(global.currentDom, dom)
                        })
                    }
                }
                this.currentTop = ev.y
            }
        },
        dragleave(ev) {
            ev.preventDefault()
            // if (global.currentDom == ev.currentTarget) {
            //     console.log('gery')
            //     global.currentDom.className = 'todo-list-grey'
            // }
        },
        dragend(ev) {
            ev.preventDefault()
            console.log('end', ev.currentTarget.innerText)
            global.currentDom.className = 'todo-list'
            let entries = Object.entries(ev.currentTarget.parentNode.children)
            let orders = [],
                data = [],
                dic = {}
            for (const [key, value] of entries) {
                if (value.id != '') {
                    orders.push(value.id)
                }
            }
            this.tempList.forEach((todo) => {
                dic[todo.id] = todo
            })
            orders.forEach((order) => {
                data.push(dic[order])
            })
            console.log(orders, data, dic)
            let todoLists = JSON.parse(localStorage.getItem('todoLists'))
            todoLists[this.todoIndex].todos = data
            localStorage.todoLists = JSON.stringify(todoLists)
            this.resetDom()
        },
        resetDom() {
            global.currentDom = {}
            global.targetDom = {}
        }
    }
}
</script>