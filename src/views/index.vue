<style scoped>
    .box{
        background-color: rgb(232, 233,230);
        padding: 10px;
        margin: 5px;
        border-radius: 10px;
    }

    .check{
        background-color: white;
        margin-bottom: 10px;
        padding: 10px 5px 10px 5px;
        border-radius: 5px;
    }

    .icon1{
        float: right;
    }

    .prog{
        padding-bottom: 5px;

    }

    .deadline{
        margin-left: 19px;
        margin-top: 5px;
        color:#9ea7b4;
    }

    .inpt{
        margin-bottom: 5px;
    }

    .dp{
        margin-bottom: 10px;
    }

    .addItem{
        margin-bottom: 5px;
    }

    #newItem{
        text-align: center;
    }

    .ivu-btn:focus{
        box-shadow: none;
    }

    .drop{
        color: #9ea7b4;
    }

    .done{
        text-decoration: line-through;
        text-decoration-color: #9ea7b4;
        color: #9ea7b4;
    }

    .workName{
        font-size: 125%;
        font-weight: bold;
    }

    .beginTime{
        margin-top: 5px;
    }

    .bTime{
        margin-left: 15px;
    }

    .Description{
        margin-top: 5px;
    }

    .comment{
        margin-top: 5px;
    }

    .inputComment{
        margin-top: 5px;
    }

    a{
        color: #495060;
    }
</style>
<template>
    <div class="index">
        <Row>
            <Col span="6">
            <div class="box">
                <div>
                    <span>要做</span>
                    <Icon class="icon1" type="ios-arrow-down"></Icon>
                    <Progress :percent="percent1" class="prog">
                        <span>{{todoDone}}/{{todoNum}}</span>
                    </Progress>
                </div>
                <div class="check"
                    :todo="todo"
                    v-for="todo in todos"
                    :key="todo.todoId"
                    @click="todoDetail=true">


                    <!-- 任务详情对话框 -->
                    <Modal
                        v-model="todoDetail"
                        title="任务详情"
                        @on-ok="detailOk"
                        @on-cancel="detailCancel">
                        <span class="workName">{{todo.content}}</span>
                        <Dropdown trigger="click" class="icon1">
                            <a class="drop" href="javascript:void(0)">
                                <Icon  type="ios-arrow-down"></Icon>
                            </a>
                            <DropdownMenu slot="list">
                                <DropdownItem>归档</DropdownItem>
                                <DropdownItem> <a @click="deleteTodo">删除</a></DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                        <br>
                        <div class="beginTime">
                            <span>起始时间：</span>
                            <span class="bTime">
                                <Icon type="ios-calendar-outline"></Icon>
                                {{todo.beginTime}}
                            </span>
                        </div>
                        <div
                            class="Description" 
                            v-show="initDescription" 
                            @click="editDescription">
                            <p v-if="todo.description===''">点击添加描述</p>
                            <p v-else>{{todo.description}}</p>
                        </div>
                        <div 
                            v-show="newDescription"
                            @keyup.enter="addDescription">
                            <Input 
                                v-model="todoDescription"
                                placeholder="敲击回车添加描述">
                            </Input>
                        </div>
                        <div>
                            <p class="comment">备注：</p>
                            <div
                                :todoComment="todoComment"
                                v-for="todoComment in todoComments"
                                :key="todoComment.id">
                                <div>{{todoComment.time}}</div>
                                <div>{{todoComment.content}}</div>
                            </div>
                            <Input 
                                class="inputComment"
                                v-model="addComment"
                                placeholder="敲击回车添加备注"
                                @on-keyup.enter="addTodoComment">
                            </Input>
                        </div>
                    </Modal>



                    <!-- 大致任务信息显示 -->
                    <Checkbox v-model="todo.selected">
                        <span :class="{done: todo.selected}">{{todo.content}}</span>
                        <div class="deadline" v-if="todo.time !== ''">
                            <Icon type="clock"></Icon>
                            {{todo.time}}
                            <span>截止</span>
                        </div>
                    </Checkbox>
                </div>

                <!-- 添加新任务 -->
                <div v-show="modal1" class="addItem">
                    <Input 
                        class="inpt"
                        placeholder="填入任务名称"
                        v-model="inputTodo">
                    </Input>
                    <DatePicker
                        class="dp"
                        :open="open1"
                        :value="value1"
                        :options="option"
                        type="date"
                        @on-change="handleChange1"
                        >
                        <a class="drop" href="javascript:void(0)" @click="handleClick1">
                            <Icon type="ios-calendar-outline"></Icon>
                            <template v-if="value1 === ''">选择截止日期</template>
                            <template v-else>{{ value1 }}</template>
                        </a>
                    </DatePicker>
                    <br>
                    <Button type="primary" @click="ok1">确定</Button>
                    <Button type="text" @click="cancel1">取消</Button>
                </div>
                <Button 
                    v-show="add1"
                    type="text" 
                    icon="plus-round" 
                    @click="NewTodo"
                    size="small">
                    添加新任务
                </Button>
            </div>
            </Col>

            <Col span="6">
            <div class="box">
                <div>
                    <span>在做</span>
                    <Icon class="icon1" type="ios-arrow-down"></Icon>
                    <Progress :percent="percent2" class="prog">
                        <span>0/{{doingNum}}</span>
                    </Progress>
                </div>
                <div class="check"
                    :doing="doing"
                    v-for="doing in doings"
                    :key="doing.doingId">
                    <Checkbox v-model="doing.selected">
                        <span :class="{done: doing.selected}">{{doing.content}}</span>
                        <div class="deadline" v-if="doing.time !== ''">
                            <Icon type="clock"></Icon>
                            {{doing.time}}
                            <span>截止</span>
                        </div>
                    </Checkbox>
                </div>
                <div v-show="modal2" class="addItem">
                    <Input 
                        class="inpt"
                        placeholder="填入任务名称"
                        v-model="inputDoing">
                    </Input>
                    <DatePicker
                        class="dp"
                        :open="open2"
                        :value="value2"
                        :options="option"
                        type="date"
                        @on-change="handleChange2">
                        <a class="drop" href="javascript:void(0)" @click="handleClick2">
                            <Icon type="ios-calendar-outline"></Icon>
                            <template v-if="value2 === ''">选择截止日期</template>
                            <template v-else>{{ value2 }}</template>
                        </a>
                    </DatePicker>
                    </br>
                    <Button type="primary" @click="ok2">确定</Button>
                    <Button type="text" @click="cancel2">取消</Button>
                </div>
                <Button 
                    v-show="add2"
                    type="text" 
                    icon="plus-round" 
                    @click="NewDoing"
                    size="small">
                    添加新任务
                </Button>
            </div>
            </Col>

            <Col span="6">
            <div  class="box">
                <div>
                    <span>待定</span>
                    <Icon class="icon1" type="ios-arrow-down"></Icon>
                    <Progress :percent="percent3" class="prog">
                        <span>0/{{waitingNum}}</span>
                    </Progress>
                </div>
                <div class="check"
                    :waiting="waiting"
                    v-for="waiting in waitings"
                    :key="waiting.waitingId">
                    <Checkbox v-model="waiting.selected">
                        <span :class="{done: waiting.selected}">{{waiting.content}}</span>
                        <div class="deadline" v-if="waiting.time !== ''">
                            <Icon type="clock"></Icon>
                            {{waiting.time}}
                            <span>截止</span>
                        </div>
                    </Checkbox>
                </div>
                <div v-show="modal3" class="addItem">
                    <Input 
                        class="inpt"
                        placeholder="填入任务名称"
                        v-model="inputWaiting">
                    </Input>
                    <DatePicker
                        class="dp"
                        :open="open3"
                        :value="value3"
                        :options="option"
                        type="date"
                        @on-change="handleChange3">
                        <a class="drop" href="javascript:void(0)" @click="handleClick3">
                            <Icon type="ios-calendar-outline"></Icon>
                            <template v-if="value3 === ''">选择截止日期</template>
                            <template v-else>{{ value3 }}</template>
                        </a>
                    </DatePicker>
                    </br>
                    <Button type="primary" @click="ok3">确定</Button>
                    <Button 
                        type="text" @click="cancel3"> 取消</Button>
                </div>
                <Button 
                    v-show="add3"
                    type="text" 
                    icon="plus-round" 
                    @click="NewWaiting"
                    size="small">
                    添加新任务
                </Button>
            </div>
            </Col>
            <Col span="6">
            <div class="box">
                <Button 
                    type="text" 
                    icon="plus-round" 
                    @click="modal4=true"
                    id="newItem">
                    新建列表
                </Button>
            </div>
            </Col>
        </Row>
    </div>
</template>
<script>
    let todoId=0
    let doingId=0
    let waitingId=0
    let todoCommentId=0
    let day=0
    let month=0
    let year=0
    let hour=0
    let minute=0

    export default {
        data () {
            return {
                percent1: 0,
                percent2: 0,
                percent3: 0,

                modal1: false,
                modal2: false,
                modal3: false,
                modal4: false,

                add1: true,
                add2: true,
                add3: true,

                value1: '',
                value2: '',
                value3: '',

                open1: false,
                open2: false,
                open3: false,

                inputTodo: '',
                inputDoing: '',
                inputWaiting: '',

                todoNum: 0,
                doingNum: 0,
                waitingNum: 0,

                todoDone: 0,

                todoDetail: false,

                todoDescription: '',

                initDescription: true,

                newDescription: false,

                todoComments: [],

                addComment: '',

                bTime: '',
                commentTime: '',

                todos: [],
                doings: [],
                waitings: [],

                option: {
                    disabledDate(date){
                        return date && date.valueOf() < Date.now() - 86400000;
                    }
                },
            }
        },

        methods : {

            //任务详情
            detailOk () {
                
            },
            detailCancel () {
                
            },
            editDescription () {
                this.initDescription = false;
                this.newDescription = true;
            },
            addDescription () {
                this.initDescription = true;
                this.newDescription = false;
                //这里想要把todoDescription赋值给todo.description






                
            },
            deleteTodo (Id) {
                this.todos.splice(this.todos.findIndex(todo=>todo.todoId===Id),1);
                this.todoDetail = false;
            },
            addTodoComment () {
                this.commentTime = new Date();
                minute = this.commentTime.getMinutes();
                hour = this.commentTime.getHours();
                if(minute<10 && hour>10){
                    this.commentTime=hour+":0"+minute;
                }
                else if(minute>10 && hour>10){
                    this.commentTime=hour+":"+minute;
                }
                else if(minute<10 && hour<10){
                    this.commentTime="0"+hour+":0"+minute
                }
                else{
                    this.commentTime="0"+hour+":"+minute
                }
                this.todoComments.push({
                    content: this.addComment,
                    time: this.commentTime,
                    id: todoCommentId,
                });
                todoCommentId++;
                this.addComment='';

            },

            //截止日期选择
            handleClick1 () {
                this.open1 = !this.open1;
            },
            handleClick2 () {
                this.open2 = !this.open2;
            },
            handleClick3 () {
                this.open3 = !this.open3;
            },

            handleChange1 (date) {
                this.value1 = date;
                this.open1 = false;
            },
            handleChange2 (date) {
                this.value2 = date;
                this.open2 = false;
            },
            handleChange3 (date) {
                this.value3 = date;
                this.open3 = false;
            },

            //添加新任务
            NewTodo () {
                this.modal1=true;
                this.add1=false;
            },
            ok1 () {
                this.bTime = new Date();
                day = this.bTime.getDate();
                month = this.bTime.getMonth()+1;
                year = this.bTime.getFullYear();
                this.todos.push({
                    todoId:todoId++,
                    content:this.inputTodo,
                    selected:false,
                    time: this.value1,
                    description: this.todoDescription,
                    flag:0,
                    beginTime: year+"-"+month+"-"+day,
                });
                this.inputTodo='';
                this.value1='';
                this.todoNum++;
                this.bTime='';
            },
            cancel1 () {
                this.modal1=false;
                this.add1=true;
                this.inputTodo='';
                this.value1='';
            },

            NewDoing () {
                this.modal2=true;
                this.add2=false;
            },
            ok2 () {
                this.doings.push({
                    doingId:doingId++,
                    content:this.inputDoing,
                    selected:false,
                    time: this.value2,
                });
                this.inputDoing='';
                this.value2='';
                this.doingNum++;
            },
            cancel2 () {
                this.modal2=false;
                this.add2=true;
                this.inputDoing='';
                this.value2='';
            },

            NewWaiting () {
                this.modal3=true;
                this.add3=false;
            },
            ok3 () {
                this.waitings.push({
                    waitingId:waitingId++,
                    content:this.inputWaiting,
                    selected:false,
                    time: this.value3,
                });
                this.inputWaiting='';
                this.value3='';
                this.waitingNum++;
            },
            cancel3 () {
                this.modal3=false;
                this.add3=true;
                this.inputWaiting='';
                this.value3='';
            },


            //进度条上已经完成的任务数量
            totalTodo () {
                
                // for(i=0,i<this.todoNum,i++){
                //     if(todos[i].selected){
                //         flag=1;
                //     }
                // }
                // for(i=0,i<this.todoNum,i++){
                //     if(todos[i].flag===1){
                //         if(todos[i].selected){
                //             todoDone++;
                //         }
                //         else{
                //             todoDone--;
                //         }
                //     }
                // }
            }
        },
        mounted(){
            this.totalTodo()
        },
    };
</script>