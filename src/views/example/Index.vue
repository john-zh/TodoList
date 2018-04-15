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
            // 当前 todoLists 中所有 todo 的索引字典
            todosDic: [],
            // 当列表间拖动时暂存交换数据
            transInfo: {
                isTrans: false,
                parentNode: {},
                isButton: false,
                targetNode: {}
            }
        }
    },
    mounted() {
        // 下面语句用于清空缓存并初始化所有数据
        // localStorage.setItem("todoLists", JSON.stringify(this.todoLists))

        // 每次页面刷新初始化
        this.initData()
    },
    computed: {},
    methods: {
        /**
         * 每次数据变化后 重新初始化 todoLists 以及 todosDic 数据
         */
        initData() {
            if (localStorage.todoLists) {
                this.todoLists = JSON.parse(localStorage.getItem('todoLists'))
                this.todosDic = {}
                this.todoLists.forEach((todoList, index_1) => {
                    todoList.todos.forEach((todo, index_2) => {
                        todo.id = `${index_1}-${index_2}`
                        this.todosDic[todo.id] = todo
                    })
                })
            } else {
                localStorage.setItem("todoLists", JSON.stringify(this.todoLists))
            }
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
            localStorage.todoLists = JSON.stringify(this.todoLists)
            this.initData()
            this.newTodoList.title = ''
            this.newTodoList.isAdding = false
        },

        /**
         * @augments index 当前列表索引
         * 点击添加按钮展示输入框
         */
        preAddTodo(index) {
            this.newTodo.isAdding = true
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
            localStorage.setItem("todoLists", JSON.stringify(this.todoLists))
            this.initData()
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
                isAdding: true,
                content: '',
                endTime: '',
                open: false
            }
        },

        /**
         * 清空当前列表
         */
        empty(index) {
            this.$set(this.todoLists[index], 'todos', [])
            // this.todoLists[index].todos = []
            localStorage.todoLists = JSON.stringify(this.todoLists)
            this.initData()
        },

        /**
         * @augments dom 对象节点
         * 获取对象节点数据在 todoLists 中的位置
         */
        getDomIndex(dom) {
            let index = []
            let flag = false
            for (let x in this.todoLists) {
                let tempList = this.todoLists[x]
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

        /**
         * 处理开始拖动事件
         */
        dragstart(ev) {
            //初始化当前拖动对象
            if (this.currentDom != ev.currentTarget) {
                this.currentDom = ev.currentTarget
                this.currentNext = this.currentDom.nextElementSibling
                this.currentTop = ev.y
                // 将当前拖动对象节点变为空白
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
            if (this.targetDom != ev.currentTarget && this.targetDom != this.currentDom) {
                this.targetDom = ev.currentTarget
                this.targetParent = this.targetDom.parentNode
                this.targetNext = this.targetDom.nextElementSibling
            }
            // 如果拖动对象 不是 当前节点 则执行交换
            if (this.currentDom != ev.currentTarget) {
                //将目标列表所有节点放进currentDoms
                this.currentDoms = []
                let entries = Object.entries(ev.currentTarget.parentNode.children)
                for (const [key, value] of entries) {
                    if (value.id != '') {
                        this.currentDoms.push(value)
                    }
                }
                //判断拖动对象和目标对象是否临近 并判断是否同一个列表
                let result = this.isBeside(ev)
                //如果是同一列表并且临近
                if (result.flag) {
                    //判断拖动对象和目标对象相对位置以执行交换操作
                    if (this.currentTop < ev.y) {
                        ev.currentTarget.parentNode.insertBefore(ev.currentTarget, this.currentDom)
                    } else {
                        ev.currentTarget.parentNode.insertBefore(this.currentDom, ev.currentTarget)
                    }
                    //如果是不同列表
                } else if (result.trans) {
                    //暂存目标对象相关数据 待拖动完成执行数据更新
                    this.transInfo.isTrans = true
                    this.transInfo.parentNode = this.currentDom.parentNode
                    this.transInfo.isButton = isButton
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
        saveDomsToStorage(dom, isEnd) {
            // 获取父节点下所有子节点
            let entries = Object.entries(dom.children)

            let orders = [],
                data = []
            // 获取当前子节点排列顺序
            for (const [key, value] of entries) {
                if (value.id != '') {
                    orders.push(value.id)
                }
            }
            // 组装当前 todoList 需要更新的数据
            orders.forEach((order) => {
                data.push(this.todosDic[order])
            })

            if (!isEnd) {
                // 如果是列表间交换 执行之前暂存的数据更新
                if (this.transInfo.isTrans) {
                    let [current_x, current_y] = this.getDomIndex(this.currentDom)
                    if (this.transInfo.isButton) {
                        this.todoLists[this.transInfo.targetNode.parentNode.id].todos.push(this.todoLists[current_x].todos[current_y])
                    } else {
                        let [listIndex, listIndex_y] = this.getDomIndex(this.transInfo.targetNode)
                        this.todoLists[this.transInfo.targetNode.parentNode.id].todos.splice(listIndex_y, 0, this.todoLists[current_x].todos[current_y])
                    }
                }
            } else {
                /**
                 * 由于 Vue.js 会实时更新节点数据
                 * 而拖动对象节点和目标节点已经交换
                 * 这样数据更新后会发生节点看起来并没有交换的情况
                 * 
                 * 也就是说页面上的两个节点交换了一次,但是节点中的数据又交换了一次
                 * 实际效果就等于完全没有交换
                 * 
                 * 所以待拖动完成后将拖动对象节点和目标节点还原到原来的位置
                 */
                this.currentNext.parentNode.insertBefore(this.currentDom, this.currentNext)
                this.targetNext.parentNode.insertBefore(this.targetDom, this.targetNext)
            }
            // 更新当前列表
            this.todoLists[dom.id].todos = data
        },

        /** 
         * 处理拖动结束事件
         */
        dragend(ev) {
            // 阻止浏览器的默认拖放行为
            ev.preventDefault()
            // 还原拖动对象样式
            this.currentDom.className = 'todo-list'
            // 如果列表间交换则先处理需要交换的数据
            if (this.transInfo.isTrans) {
                this.saveDomsToStorage(this.transInfo.parentNode)
                this.resetTransInfo()
            }
            // 更新当前列表数据
            this.saveDomsToStorage(this.targetParent, true)

            // 将整体数据缓存到浏览器
            localStorage.todoLists = JSON.stringify(this.todoLists)
            // 每次数据更新后都要初始化
            this.initData()

            this.resetDom()
        },
        resetTransInfo() {
            this.transInfo = {
                isTrans: false,
                parentNode: {},
                isButton: false,
                targetNode: {}
            }
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