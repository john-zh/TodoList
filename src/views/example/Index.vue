<template>
<div id="example">
    <div class="body">
        <div class="raw" v-for="(todoList, listIndex) in todoLists" :key="todoList.id">
            <div class="box">
                <div class="box-title">
                    <span>{{todoList.title}}</span>
                    <Dropdown trigger="click" placement="bottom-start">
                        <Icon class="icon1" type="ios-arrow-down"></Icon>
                        <DropdownMenu slot="list">
                            <DropdownItem>
                                <a @click="empty(todoList.id)">
                                    清空
                                </a>
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
                <div :id="todoList.id">
                    <i-progress :todoList="todoList.todos"></i-progress>
                    <!-- <transition-group name="flip-list" tag="div"> -->
                    <div v-for="todo of todoList.todos" :key="todo.id" :id="todo.id" class="todo-list" draggable="true" @dragstart="dragstart($event)" @dragenter="dragenter($event)" @dragend="dragend($event)">
                        <Card shadow>
                            <div class="card-content">
                                <div class="check-box">
                                    <Checkbox v-model="todo.selected" @on-change="(n) => {onChange(n, todo)}">
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
                        <Button type="text" icon="plus-round" v-if="!newTodo.isAdding || newTodo.listId != todoList.id" @click="preAddTodo(todoList.id, listIndex)" style="margin-left: -10px;">
                            添加新任务
                        </Button>
                        <div v-if="newTodo.isAdding && newTodo.listId == todoList.id" class="add-new-todo" @keyup.enter="addNewTodo">
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
                <Button type="text" icon="plus-round" v-if="!newTodoList.isAdding" @click="preAddTodoList" id="newItem">
                    新建列表
                </Button>
                <div v-if="newTodoList.isAdding" @keyup.enter="addTodoList">
                    <Input v-model="newTodoList.title" ref="title"></Input>
                    <div class="button-group">
                        <Button type="primary" @click="addTodoList">确定</Button>
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
import Service from "../../service/service"
export default {
    name: 'example',
    components: {
        // TodoList,
        iProgress
    },
    data() {
        return {
            // 整体 todoLists 对象
            todoLists: [{
                title: '要做',
                todos: []
            }],
            // 新建 todoList 暂存对象
            newTodoList: {
                isAdding: false,
                title: '',
            },
            // 新建 todo 暂存对象
            newTodo: {
                listId: '',
                index: '',
                isAdding: false,
                content: '',
                endTime: '',
                open: false
            },
            /**
             * 拖动时暂存对象节点
             */
            // 当前拖动对象节点
            currentDom: {},
            // 当前拖动对象节点向下兄弟节点
            currentNext: {},
            // 拖动交换对象节点
            targetDom: {},
            // 拖动交换对象节点向下兄弟节点
            targetNext: {},
            // 当前拖动对象节点的父节点
            targetParent: {},
            // 拖动交换对象父节点的所有子节点
            currentDoms: [],
            // 当前拖动对象节点高度
            currentTop: '',
            // 标记是否在列表间移动后又在列表内移动
            moveAfterTrans: 0,
            // 暂存列表间交换数据
            transInfo: {
                isTrans: false,
                targetNode: {}
            },
        }
    },
    mounted() {
        // 下面语句用于清空缓存并初始化所有数据
        // Service.init()

        // Service.addTodoList({
        //     title: '要做',
        //     todos: []
        // })

        // 每次页面刷新初始化
        this.todoLists = Service.getTodoLists()

        // 初始化时计算进度条百分比
        this.updateProcess()
    },
    watch: {
        todoLists: {
            handler: function() {
                this.updateProcess()
            },
            deep: true
        },
    },
    computed: {},
    methods: {
        
        /**
         * 屏蔽 iView 自动更新, 用 jQuery 手动更新进度条
         */
        updateProcess() {
            this.$nextTick(function() {
                if ($('.ivu-progress-bg').length != 0) {
                    for (let i = 0; i < $($('.ivu-progress-bg')).length; i++) {
                        let processBg = $('.ivu-progress-bg')[i]
                        let processText = $('.ivu-progress-text')[i]
                        let parent = $($('.progress')[i]).parent()
                        let children = parent.find('.todo-list')
                        let checked = children.find('.ivu-checkbox-checked')
                        let todo = children.length,
                            done = checked.length
                        let percent = todo == 0 || done == 0 ? 0 : done / todo.toFixed(2) * 100
                        $(processBg).css('width', `${percent}%`)
                        $(processText).text(`${done}/${todo}`)
                    }
                }
            })
        },

        /**
         * 点击添加按钮展示输入框
         */
        preAddTodoList() {
            this.newTodoList.isAdding = true
            this.$nextTick(function() {
                this.$refs.title.focus()
            })
        },

        /**
         * 添加新的 todoList
         */
        addTodoList() {
            let data = {
                title: this.newTodoList.title,
                todos: []
            }
            this.todoLists.push(data)
            Service.addTodoList(data)
            this.newTodoList.title = ''
            this.newTodoList.isAdding = false
        },

        /**
         * @augments index 当前列表索引
         * 点击添加按钮展示输入框
         */
        preAddTodo(id, index) {
            this.newTodo.isAdding = true
            this.newTodo.listId = id
            this.newTodo.index = index
            // 输入框自动获取焦点
            this.$nextTick(function() {
                this.$refs.input[0].focus()
            })
        },

        /**
         * 添加新的 todo
         */
        addNewTodo() {
            let data = {
                content: this.newTodo.content,
                selected: false,
                endTime: this.newTodo.endTime,
            }
            this.todoLists[this.newTodo.index].todos.push(data)
            Service.addTodo(data, this.newTodo.listId)
            this.resetNewTodo()
        },

        /**
         * 日期选择后立即关闭弹窗
         */
        handleChange(value) {
            this.newTodo.endTime = value
            this.newTodo.open = false;
        },

        /**
         * 初始化暂存数据
         */
        resetNewTodo() {
            this.newTodo = {
                index: this.newTodo.index,
                listId: this.newTodo.listId,
                isAdding: true,
                content: '',
                endTime: '',
                open: false
            }
        },
        
        /**
         * 处理 checkbox 状态改变
         */
        onChange(value, todo) {
            todo.selected = value
            Service.updateTodo(todo)
        },

        /**
         * 清空当前列表
         */
        empty(index) {
            this.todoLists[index].todos = []
            Service.updateTodos([], index)
        },

        /**
         * 处理开始拖动事件
         */
        dragstart(ev) {
            //初始化当前拖动对象
            if (this.currentDom != ev.currentTarget) {
                this.currentDom = ev.currentTarget
                this.currentNext = ev.currentTarget.nextElementSibling
                this.currentTop = ev.y
                // 调整当前拖动对象节点背景色
                this.currentDom.className = 'todo-list-none'
            }
        },

        /** 
         * @augments isButton 标记当前节点是否为按钮
         * 处理拖动进入事件
         */
        dragenter(ev, isButton) {
            // 阻止浏览器的默认拖放行为
            ev.preventDefault()
            // 初始化拖放交换对象
            // 如果拖动对象 不是 当前节点 则执行交换
            if (this.currentDom != ev.currentTarget) {
                if (this.targetDom != ev.currentTarget && this.targetDom != this.currentDom) {
                    this.targetDom = ev.currentTarget
                    this.targetParent = this.targetDom.parentNode
                    this.targetNext = this.targetDom.nextElementSibling
                }
                //将目标列表所有节点放进currentDoms
                this.currentDoms = []
                let children = ev.currentTarget.parentNode.children
                for (let i = 0; i < children.length; i++){
                    let item = children[i]
                    if (item.id != '') {
                        this.currentDoms.push(item)
                    }
                }
                //判断拖动对象和目标对象是否临近 并判断是否同一个列表
                let result = this.isBeside(ev)
                //如果是同一列表并且临近
                if (result.flag) {
                    //判断拖动对象和目标对象相对位置以执行交换操作
                    if (this.currentTop < ev.y) {
                        this.moveAfterTrans = -1
                        ev.currentTarget.parentNode.insertBefore(ev.currentTarget, this.currentDom)
                    } else {
                        this.moveAfterTrans = 1
                        ev.currentTarget.parentNode.insertBefore(this.currentDom, ev.currentTarget)
                    }
                    //如果是不同列表
                } else if (result.trans) {
                    this.moveAfterTrans = 0
                    //暂存目标对象相关数据 待拖动完成执行数据更新
                    this.transInfo.isTrans = true
                    this.transInfo.targetNode = ev.currentTarget
                    //目标对象在不同列表默认将当前节点放于目标节点上方
                    ev.currentTarget.parentNode.insertBefore(this.currentDom, ev.currentTarget)
                    //如果是同一列表并且不临近
                } else {
                    //获取对象间所有节点
                    let doms = result.middleDoms
                    //根据相对位置以此交换节点
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
                // 更新当前节点的高度
                this.currentTop = ev.y
            }
        },

        /**
         * 判断拖动对象和目标对象是否临近 并判断是否同一个列表
         */
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
            // 如果当前节点或者目标节点不在目标列表 则可以判断为列表间交换
            if (!isCurrentDomIn || !isTargetDomIn) {
                return {
                    flag: flag,
                    middleDoms: middleDoms,
                    trans: true
                }
            }
            // 如果当前节点与目标节点索引相差1 则可以判断为临近节点
            if (currentIndex == targetIndex + 1 || currentIndex == targetIndex - 1) {
                flag = true
                // 如果不是临近节点 则将中间节点及目标节点都存放到 middleDoms
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

        /**
         * 拖动完成 执行数据更新
         */
        saveDomsToStorage(dom) {
            let orders = []
            // 获取当前子节点排列顺序
            for (let i = 0; i < dom.children.length; i++) {
                const item = dom.children[i]
                if (item.id != '') {
                    orders.push(item.id)
                }
            }
            
            Service.updateTodos(orders, dom.id)
        },

        /** 
         * 处理拖动结束事件
         */
        dragend(ev) {
            // 阻止浏览器的默认拖放行为
            ev.preventDefault()
            // 还原拖动对象样式
            this.currentDom.className = 'todo-list'

            // 如果列表间拖动, 先更新源列表
            if (this.transInfo.isTrans) {
                this.saveDomsToStorage(this.transInfo.targetNode.parentNode)
                this.resetTransInfo()
            }

            // 更新当前列表
            this.saveDomsToStorage(this.currentNext.parentNode)

            this.updateProcess()

            this.resetDom()
        },
        resetDom() {
            this.currentDoms = []
            this.currentDom = {}
            this.targetDom = {}
            this.targetNext = {}
            this.targetParent = {}
        },
        resetTransInfo() {
            this.transInfo = {
                isTrans: false,
                targetNode: {}
            }
        },
    }
}
</script>