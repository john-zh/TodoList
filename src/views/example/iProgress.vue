<template>
<div class="progress">
    <Progress :percent="percent">
        <span>{{todoDone}}/{{todoNum}}</span>
    </Progress>
</div>
</template>
<script>
export default {
    props: ["todoList"],
    data() {
        return {

        }
    },
    mounted() {
        
    },
    computed: {
        todoDone() {
            let todoDone = 0
            this.todoList.forEach((item) => {
                if (item.selected) {
                    todoDone += 1
                }
            })
            // return todoDone
            return 0
        },
        todoNum() {
            // return this.todoList.length
            return 0
        },
        percent() {
            // if (this.todoNum == 0)
            //     return
            // return (this.todoDone / this.todoNum).toFixed(2) * 100
            return 0
        }
    }
}
</script>