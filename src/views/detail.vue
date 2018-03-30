<template>
	<div>
		<Modal
            v-model="Detail"
            title="任务详情"
            @on-ok="detailOk"
            @on-cancel="detailCancel">
            <span class="workName">{{item.content}}</span>
            <Dropdown trigger="click" class="icon1">
                <a class="drop" href="javascript:void(0)">
                	<Icon  type="ios-arrow-down"></Icon>
                </a>
            	<DropdownMenu slot="list">
                	<DropdownItem>归档</DropdownItem>
                    <DropdownItem><a @click="emitDelete">删除</a></DropdownItem>
            	</DropdownMenu>
            </Dropdown>
            <br>
            <div class="beginTime">
                <span>起始时间：</span>
                <span class="bTime">
                	<Icon type="ios-calendar-outline"></Icon>
                    {{item.beginTime}}
                </span>
            </div>
            <div
                class="Description" 
                v-show="initDescription" 
                @click="editDescription">
                <p v-if="todoDescription===''">点击添加描述</p>
                <p v-else>{{todoDescription}}</p>
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
	</div>
</template>

<script>
	let hour=0
    let minute=0
    let todoCommentId=0

	export default{
		props: {
			item: {
				type: Object,
				required: true,
			},
			Detail: {
				type: Boolean,
				required: true,
			},
		},

		data () {
			return{
	            todoDescription: '',
	            initDescription: true,
	            newDescription: false,
	            todoComments: [],
	            addComment: '',
	            commentTime: '',
        	}
		},

		methods: {
			detailOk () {
				this.$emit('update:Detail',false);
			},
			detailCancel () {
				this.$emit('update:Detail',false);
			},
			editDescription () {
                this.initDescription = false;
                this.newDescription = true;
            },
            addDescription () {
                this.initDescription = true;
                this.newDescription = false;
            },
            emitDelete () {
            	this.$emit('destroy', this.item.id);
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
		},
	}
</script>

<style>
	.icon1{
        float: right;
    }

    a{
        color: #495060;
    }

    .drop{
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
</style>