<template>
	<div>
		<div v-show="modal" class="addItem">
            <Input 
                class="inpt"
                placeholder="填入任务名称"
                v-model="inputItem">
            </Input>
            <DatePicker
                        class="dp"
                        :open="open"
                        :value="value"
                        :options="option"
                        type="date"
                        @on-change="handleChange"
                        >
                        <a class="drop" href="javascript:void(0)" @click="handleClick">
                            <Icon type="ios-calendar-outline"></Icon>
                            <template v-if="value === ''">选择截止日期</template>
                            <template v-else>{{ value }}</template>
                        </a>
                    </DatePicker>
                    <br>
                    <Button type="primary" @click="ok">确定</Button>
                    <Button type="text" @click="cancel">取消</Button>
                </div>
                <Button 
                    v-show="add"
                    type="text" 
                    icon="plus-round" 
                    @click="NewItem"
                    size="small">
                    添加新任务
                </Button>
	</div>
</template>

<script>
	let day=0
    let month=0
    let year=0
    let myId=0

	export default{

		data () {
			return {
				open: false,
				modal: false,
				add: true,
				value: '',
				inputItem: '',
				item: '',
				bTime: '',
				item:{
					id: '',
					content: '',
					selected: false,
					time: '',
					beginTime: '',
				},
				option: {
                    disabledDate(date){
                        return date && date.valueOf() < Date.now() - 86400000;
                    }
                },
			}
		},

		methods: {
			handleClick () {
                this.open = !this.open;
            },
            handleChange (date) {
                this.value = date;
                this.open = false;
            },
            NewItem () {
                this.modal=true;
                this.add=false;
            },

			ok () {
				this.bTime = new Date();
                day = this.bTime.getDate();
                month = this.bTime.getMonth()+1;
                year = this.bTime.getFullYear();
                this.item.id = myId++;
                this.item.content = this.inputItem;
                this.item.time = this.value;
                    // description: this.todoDescription,
                    // flag:0,
                this.item.beginTime = year+"-"+month+"-"+day;
                this.$emit('parentOK',{item: this.item});
                this.inputItem='';
                this.value='';
                // this.todoNum++;
                this.bTime='';
			},
			cancel () {
                this.modal=false;
                this.add=true;
                this.inputItem='';
                this.value='';
            },
		}
	}
</script>

<style>
    .addItem{
        margin-bottom: 5px;
    }

    .inpt{
        margin-bottom: 5px;
    }

    .dp{
        margin-bottom: 10px;
    }

    .drop{
        color: #9ea7b4;
    }
</style>