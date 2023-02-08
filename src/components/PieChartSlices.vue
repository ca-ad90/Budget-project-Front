<script lang="js">
import { is } from "@babel/types"
import { hsla, rgba, adjustHsl, changeHsl, rgbToHsl, hslToRgb } from "../utils/utilHsl.js"
const { default: d3 } = await import("d3")

export default {
    props: {
        _data: {
            type: Array //[{label:,value:}]
        },
        _size: {
            default: 300
        },
        _open: {
            default: false
        },
        _name: {
            default: "main"
        }
    },
    created() {
        this.$data.name = this._name
        this.$data.pieData = this._data
        this.$data.width = this._size
        this.$data.height = this._size
        this.$data.rad = this._size / 2
        this.$data.pieData.map(e => {
            e.d = this.arc(e)
            e.isOpen = false
            e.name = this._name
        })
    },
    data() {
        return {
            selectedIndex: null,
            width: 0,
            height: 0,
            rad: 0,
            paths: [],
            pieData: [],
        }
    },
    watch: {
        _open() {
            for (let slice of this.pieData) {
                slice.isOpen ? this.openSlice(slice) : this.closeSlice(slice)
            }
        }
    },
    computed: {
        isopen() { return this._open },
        innerRad() { return this.isopen ? this.rad * 0.7 : this.rad * 0.4 },
        outerRad() { return this.isopen ? this.rad * 0.95 : this.rad * 0.7 },
        selectedLabel() { return this.data[this.selectedIndex].label },
        selectedValue() { return this.data[this.selectedIndex].value },
        pie() { return d3.pie().sort(null).value(d => d.value) },
        arc() { return d3.arc().innerRadius(this.innerRad).outerRadius(this.outerRad) },
        arcOpen() { return d3.arc().innerRadius(this.innerRad + (this.rad * 0.00)).outerRadius(this.outerRad + (this.rad * 0.07)) }

    },
    methods: {
        openSlice(slice) {
            slice.d = this.arcOpen(slice)
        },
        closeSlice(slice) {
            slice.d = this.arc(slice)
        },

        textSize() {
            let label = this.$el.querySelector(".txtLabel")
            let labelBox = label.getBBox()

        },
        getColor(index) {
            let clr = this.colors[index % this.colors.length]
            let dif = Math.floor(index / this.colors.length)
            let color = adjustHsl(rgbToHsl(clr), { h: 20 * dif })
            return hsla(color)
        },
        getData() {
            let data = this.labels.map((e, i) => {
                let l = e
                let val = Math.floor(Math.random() * 100) * 10
                return { label: l, value: val, color: this.getColor(i), open: false }
            })
            this.data = data
            return data
        },
        enterSlice(d, i) {
            let index = d.index
            this.openSlice(this.pieData[index])
            let slice = this.pieData[index]
            this.$emit("hoverSlice", {
                label: slice.data.label,
                value: slice.data.value,
                color: slice.data.color,
                name: slice.name
            })
            this.$refs[`pieSlice-${this.name}`][index].setAttribute("fill", hsla(adjustHsl(d.data.color, { l: 15 })))
        },
        leaveSlice(d, i) {
            let index = d.index
            let data = this.pieData[index]
            if (!data.isOpen) {
                this.closeSlice(data)
                this.$refs[`pieSlice-${this.name}`][index].setAttribute("fill", d.data.color)
            }


        },
        clickSlice(d, i) {
            let index = d.index
            let data = this.pieData[index]
            this.$emit("sliceClick", data)
            this.pieData[index].d = this.arcOpen(d)
            this.pieData[index].isOpen = !this.pieData[index].isOpen
            this.pieData.filter(e => (e.index != index && e.isOpen)).forEach(e => {
                this.pieData[e.index].isOpen = false
                this.closeSlice(this.pieData[e.index])
                this.$refs[`pieSlice-${this.name}`][e.index].setAttribute("fill", this.pieData[e.index].data.color)
            })
        },
    }

}
</script>
<template>
    <g :class="`slices ${_name}`">
        <template v-for="(val, index) in pieData" :key="index">
            <path :class="`slice ${_name}`" :d="val.d" :fill="val.data.color" :ref="`pieSlice-${_name}`"
                @mouseenter="enterSlice(val, i)" @mouseleave="leaveSlice(val, i)" @click="clickSlice(val, i)">
            </path>
        </template>
    </g>
</template>
<style scoped>
.svg-wrapper {
    position: relative;
    height: 40vh;
}

svg {
    height: 100%;
    width: 100%
}

path.slice {
    transition: 0.3s;
}

circle {
    fill: transparent
}
</style>
