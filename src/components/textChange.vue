<script>
export default {
    props: {
        id: { type: String },
        _text: {
            type: String,
            default: "",
        },
    },
    created() {
        this.text = this._text;
    },
    data() {
        return {
            isSelected: false,
            text: "",
            element: {},
        };
    },
    computed: {
        display() {
            return isSelected ? "none" : "inline-block";
        },
    },
    emits: ["closed"],
    methods: {
        openInput(e) {
            this.isSelected = true;
            console.log(e.target);
            this.element = e.target;
            this.text = this.element.textContent;
            console.log(this, this.$el)
        },
        select(e) {
            if (this.isSelected) {
                e.target.focus()
            }
        },
        write(x) {
            this.element.textContent = x;
        },
        close(e) {
            this.isSelected = false;
            e.target.addEventListener('mouseover', this.select, { once: true })
            this.$emit("closed", this.text);
        },
    },
};
</script>
<template>
    <span class="wrapper"></span>
    <span @click="openInput($event)">
        <span class="content" v-show="!isSelected">
            <slot> </slot>
        </span>
    </span>
    <input style="max-width:100%" v-show="isSelected" type="text" v-model="text" @mouseover.once="select($event)"
        @input="write(text)" @blur="close($event)" active />
</template>
