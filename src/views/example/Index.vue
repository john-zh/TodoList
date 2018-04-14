<template>
<div id="example">
    <div class="body">
        <div class="raw" v-for="(todoList, listIndex) in todoLists" :key="listIndex">
            <div class="box">
                <div class="box-title">
                    <span>{{todoList.title}}</span>
                    <Dropdown trigger="click" placement="bottom-start">
                        <Icon class="icon1" type="ios-arrow-down"></Icon>
                        <DropdownMenu slot="list">
                            <DropdownItem>
                                <a @click="empty(listIndex)">
                                    清空
                                </a>
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
                <div :id="listIndex">
                    <i-progress :todoList="todoList.todos"></i-progress>
                    <!-- <transition-group name="flip-list" tag="div"> -->
                    <div v-for="(todo, index) of todoList.todos" :key="index" :id="`${listIndex}-${index}`" class="todo-list" draggable="true" @dragstart="dragstart($event)" @dragenter="dragenter($event)" @dragend="dragend($event)">
                        <Card shadow>
                            <div class="card-content">
                                <div class="check-box">
                                    <Checkbox v-model="todo.selected" @change="initData">
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
                    <div @dragenter="dragenter($event, true)">
                        <Button type="text" icon="plus-round" v-if="!newTodo.isAdding || newTodo.index != listIndex" @click="preAddTodo(listIndex)" style="margin-left: -10px;">
                            添加新任务
                        </Button>
                        <div v-if="newTodo.isAdding && newTodo.index == listIndex" class="add-new-todo" @keyup.enter="addNewTodo">
                            <Input ref="input" v-model="newTodo.content" type="textarea"></Input>
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
                                <Button type="primary" @click="addNewTodo">确定</Button>
                                <Button @click="newTodo.isAdding = false">取消</Button>
                            </div>
                        </div>
                    </div>
                    <!-- <todo-list :todo-index="index" :data="todoList.todos" :add-todo="doAddTodo" :update-todo="doUpdateTodo" :input-focus="inputFocus"></todo-list> -->
                </div>
            </div>
        </div>
        <div class="raw">
            <div class="box">
                <Button type="text" icon="plus-round" v-if="!newTodoList.isAdding" @click="addTodoList" id="newItem">
                    新建列表
                </Button>
                <div v-if="newTodoList.isAdding" @keyup.enter="doAddTodoList">
                    <Input v-model="newTodoList.title" ref="title"></Input>
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
// import TodoList from "./TodoList";
import iProgress from "./iProgress";
export default {
    name: 'example',
    components: {
        // TodoList,
        iProgress
    },
    data() {
        return {
            newTodo: {
                index: '',
                isAdding: false,
                content: '',
                endTime: '',
                open: false
            },
            newTodoList: {
                isAdding: false,
                title: '',
            },
            todoLists: [{
                title: '要做',
                todos: []
            }],
            currentDom: {},
            targetDom: {},
            targetParent: {},
            currentDoms: [],
            currentTop: '',
            targetList: [],
            tempLists: [],
            currentNext: {},
            targetNext: {}
        }
    },
    mounted() {
        // localStorage.setItem("todoLists", JSON.stringify(this.todoLists))
        this.initData()
    },
    computed: {},
    methods: {
        initData() {
            if (localStorage.todoLists) {
                this.todoLists = JSON.parse(localStorage.getItem('todoLists'))
                this.tempLists = []
                this.targetList = []
                this.todoLists.forEach((todoList, index_1) => {
                    let newTodoList = JSON.parse(JSON.stringify(todoList))
                    newTodoList.todos.forEach((todo, index_2) => {
                        todo.id = `${index_1}-${index_2}`
                        this.targetList.push(todo)
                    })
                    this.tempLists.push(newTodoList)
                })
            } else {
                localStorage.setItem("todoLists", JSON.stringify(this.todoLists))
            }
        },
        addNewTodo() {
            let data = {
                content: this.newTodo.content,
                selected: false,
                endTime: this.newTodo.endTime,
            }
            this.tempLists[this.newTodo.index].todos.push(data)
            localStorage.setItem("todoLists", JSON.stringify(this.tempLists))
            this.initData()
            this.resetNewTodo()
        },
        handleChange(value) {
            this.newTodo.endTime = value
            this.newTodo.open = false;
        },
        resetNewTodo() {
            this.newTodo = {
                index: this.newTodo.index,
                isAdding: true,
                content: '',
                endTime: '',
                open: false
            }
        },
        preAddTodo(index) {
            this.newTodo.isAdding = true
            this.newTodo.index = index
            this.$nextTick(function() {
                this.$refs.input[0].focus()
            })
        },
        addTodoList() {
            this.newTodoList.isAdding = true
            this.$nextTick(function() {
                this.$refs.title.focus()
            })
        },
        doAddTodoList() {
            let data = {
                title: this.newTodoList.title,
                todos: []
            }
            this.tempLists.push(data)
            localStorage.todoLists = JSON.stringify(this.tempLists)
            this.initData()
            this.newTodoList.title = ''
            this.newTodoList.isAdding = false
        },
        empty(index) {
            this.tempLists[index].todos = []
            localStorage.todoLists = JSON.stringify(this.tempLists)
            this.initData()
        },
        getDomIndex(dom) {
            let index = []
            let flag = false
            for (let x in this.tempLists) {
                let tempList = this.tempLists[x]
                for (let y in tempList.todos) {
                    let todo = tempList.todos[y]
                    try {
                        if (todo.id == dom.id) {
                            index = [x, y]
                            flag = true
                            break
                        }
                    } catch (err) {
                        console.log('当前 todo 出现异常', todo)
                    }
                }
                if (flag)
                    break
            }
            return index
        },
        dragstart(ev) {
            if (this.currentDom != ev.currentTarget) {
                this.currentDom = ev.currentTarget
                this.currentNext = this.currentDom.nextElementSibling
                this.currentTop = ev.y
                this.currentDom.className = 'todo-list-none'
            }
        },
        dragenter(ev, isButton) {
            ev.preventDefault()
            if (this.targetDom != ev.currentTarget && this.targetDom != this.currentDom) {
                this.targetDom = ev.currentTarget
                this.targetParent = this.targetDom.parentNode
                this.targetNext = this.targetDom.nextElementSibling
            }
            if (this.currentDom != ev.currentTarget) {
                // console.log('enter', ev.currentTarget.innerText)
                //将目标列表所有节点放进currentDoms
                this.currentDoms = []
                let entries = Object.entries(ev.currentTarget.parentNode.children)
                for (const [key, value] of entries) {
                    if (value.id != '') {
                        this.currentDoms.push(value)
                    }
                }
                //判断源和目标是否临近 并判断是否同一个列表
                let result = this.isBeside(ev)
                // console.log('isBeside', result)
                //如果是同一列表并且临近
                if (result.flag) {
                    if (this.currentTop < ev.y) {
                        ev.currentTarget.parentNode.insertBefore(ev.currentTarget, this.currentDom)
                    } else {
                        ev.currentTarget.parentNode.insertBefore(this.currentDom, ev.currentTarget)
                    }
                    //如果是不同列表
                } else if (result.trans) {
                    let [current_x, current_y] = this.getDomIndex(this.currentDom)
                    let parentNode = this.currentDom.parentNode
                    // this.currentDom.parentNode.removeChild(this.currentDom)
                    ev.currentTarget.parentNode.insertBefore(this.currentDom, ev.currentTarget)
                    if (isButton) {
                        this.tempLists[ev.currentTarget.parentNode.id].todos.push(this.tempLists[current_x].todos[current_y])
                    } else {
                        let [listIndex, listIndex_y] = this.getDomIndex(ev.currentTarget)
                        this.tempLists[ev.currentTarget.parentNode.id].todos.splice(listIndex_y, 0, this.tempLists[current_x].todos[current_y])
                    }
                    this.saveDomsToStorage(parentNode)
                    //如果不同列表
                } else {
                    let doms = result.middleDoms
                    if (this.currentTop < ev.y) {
                        doms.forEach((dom) => {
                            ev.currentTarget.parentNode.insertBefore(dom, this.currentDom)
                        })
                    } else {
                        doms.forEach((dom) => {
                            ev.currentTarget.parentNode.insertBefore(this.currentDom, dom)
                        })
                    }
                }
                this.currentTop = ev.y
            }
        },
        isBeside(ev) {
            let currentIndex = -1,
                targetIndex = -1
            let flag = false
            let middleDoms = []
            let isCurrentDomIn = false
            let isTargetDomIn = false
            for (let index in this.currentDoms) {
                let item = this.currentDoms[index]
                if (item == this.currentDom) {
                    isCurrentDomIn = true
                    currentIndex = parseInt(index)
                } else if (item == ev.currentTarget) {
                    isTargetDomIn = true
                    targetIndex = parseInt(index)
                }
            }
            if (!isCurrentDomIn || !isTargetDomIn) {
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
        saveDomsToStorage(dom) {
            let entries = Object.entries(dom.children)
            let index = dom.id
            let orders = [],
                data = [],
                dic = {}
            for (const [key, value] of entries) {
                if (value.id != '') {
                    orders.push(value.id)
                }
            }
            this.targetList.forEach((todo) => {
                dic[todo.id] = todo
            })
            orders.forEach((order) => {
                data.push(dic[order])
            })
            this.tempLists[index].todos = data
            localStorage.todoLists = JSON.stringify(this.tempLists)
            // // console.log(, this.targetNext)
            // console.log(this.currentDom, this.currentNext)
            // console.log(orders, data)
            // this.currentNext.parentNode.insertBefore(this.currentDom, this.currentNext)
            // // this.targetNext.parentNode.insertBefore(this.targetDom, this.targetNext)
            // this.todoLists[index].todos = data
        },
        dragend(ev) {
            ev.preventDefault()
            this.currentDom.className = 'todo-list'
            this.saveDomsToStorage(this.targetParent)
            this.resetDom()
        },
        resetDom() {
            this.currentDoms = []
            this.currentDom = {}
            this.targetDom = {}
            this.targetParent = {}
        }
    }
}
</script>