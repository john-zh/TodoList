<style>
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

    #newItem{
        text-align: center;
    }

    .ivu-btn:focus{
        box-shadow: none;
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
                    v-for="todo in todos"
                    :key="todo.id"
                    @click="todoDetail=true"
                    >

                    <!-- 任务详情对话框 -->
                    <Detail 
                        :item="todo"
                        @destroy="deleteTodo"
                        :Detail.sync="todoDetail">
                    </Detail>

                    <!-- 大致任务信息显示 -->
                    <Check :item="todo"></Check>
                </div>

                <!-- 添加新任务 -->
                <addItem 
                    @parentOK="todoOk">
                </addItem>
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
                    :key="doing.doingId"
                    @click="doingDetail=true">

                    <!-- 任务详情对话框 -->
                    <Detail 
                        :item="doing"
                        @destroy="deleteDoing"
                        :Detail.sync="doingDetail">
                    </Detail>

                    <!-- 显示大致信息 -->
                    <Check :item="doing"></Check>
                </div>

                <!-- 添加新任务 -->
                <addItem 
                    @parentOK="doingOk">
                </addItem>
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
                    :key="waiting.waitingId"
                    @click="waitingDetail=true">

                    <!-- 任务详情对话框 -->
                    <Detail 
                        :item="waiting"
                        @destroy="deleteWaiting"
                        :Detail.sync="waitingDetail">
                    </Detail>

                    <!-- 显示大致信息 -->
                    <Check :item="waiting"></Check>
                </div>
                <!-- 添加新任务 -->
                <addItem 
                    @parentOK="waitingOk">
                </addItem>
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

    import Check from './briefInfo.vue'
    import Detail from './detail.vue'
    import addItem from './newItem.vue'

    export default {
        components: {
            Check,
            Detail,
            addItem,
        },

        data () {
            return {

                percent1: 0,
                percent2: 0,
                percent3: 0,

                modal4: false,

                todoNum: 0,
                doingNum: 0,
                waitingNum: 0,

                todoDone: 0,

                todoDetail: false,
                doingDetail: false,
                waitingDetail: false,

                todos: [],
                doings: [],
                waitings: [],
            }
        },

        methods : {
            deleteTodo (Id) {
                this.todos.splice(this.todos.findIndex(todo=>todo.id===Id),1);
                this.todoDetail = false;
            },
            deleteDoing (Id) {
                this.doings.splice(this.doings.findIndex(doing=>doing.id===Id),1);
                this.waitingDetail = false;
            },
            deleteWaiting (Id) {
                this.waitings.splice(this.waitings.findIndex(waiting=>waiting.id===Id),1);
                this.waitingDetail = false;
            },

            //添加新任务
            todoOk (payload) {
                this.todos.push(payload.item);
            },
            doingOk (payload) {
                this.doings.push(payload.item);
            },
            waitingOk (payload) {
                this.waitings.push(payload.item);
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