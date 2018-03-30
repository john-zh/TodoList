<template>
	<div>
		<Checkbox v-model="item.selected">
            <span :class="{done: item.selected}">{{item.content}}</span>
            <div class="deadline" v-if="item.time !== ''">
                <Icon type="clock"></Icon>
                {{item.time}}
            </div>
        </Checkbox>
	</div>
</template>

<script>
	export default{
		props: {
			item: {
				type: Object,
				required: true,
			}
		}
	}
</script>

<style>
	.done{
        text-decoration: line-through;
        text-decoration-color: #9ea7b4;
        color: #9ea7b4;
    }

    .deadline{
        margin-left: 19px;
        margin-top: 5px;
        color:#9ea7b4;
    }
</style>