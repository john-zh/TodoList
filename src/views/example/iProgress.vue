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
    computed: {
        todoDone() {
            let todoDone = 0
            this.todoList.forEach((item) => {
                if (item.selected) {
                    todoDone += 1
                }
            })
            return todoDone
        },
        todoNum() {
            return this.todoList.length
        },
        percent() {
            if (this.todoNum == 0)
                return
            return (this.todoDone / this.todoNum).toFixed(2) * 100
        }
    }
}
</script>