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
    },
    created() {
        this.$data.pieData = this._data
        this.$data.width = this._size
        this.$data.height = this._size
        this.$data.rad = this._size / 2
        this.$data.innerRad = this.rad * 0.5
        this.$data.outerRad = this.rad * 0.9
        this.$data.pieData.map(e => {
            let a = this.arc
            let b = this.arcOpen
            let c = this.setArc
            e.d = this.arc(e)
            e.isOpen = false
        })
    },
    data() {
        return {
            currentLabel: "Test Label",
            currentValue: "test datas",
            selectedIndex: null,
            width: 0,
            height: 0,
            rad: 0,
            innerRad: 0,
            outerRad: 0,
            paths: [],
            pieData: []


        }
    },
    computed: {
        selectedLabel() { return this.data[this.selectedIndex].label },
        selectedValue() { return this.data[this.selectedIndex].value },
        pie() { return d3.pie().sort(null).value(d => d.value) },
        arc() { return d3.arc().innerRadius(this.innerRad).outerRadius(this.outerRad) },
        arcOpen() { return d3.arc().innerRadius(this.innerRad + (this.rad * 0.02)).outerRadius(this.outerRad + (this.rad * 0.05)) }

    },
    methods: {
        openSlice(slice) {
            slice.d = this.arcOpen(slice)
        },
        closeSlice(slice) {
            slice.d = this.arc(slice)
        },
        openChart() {
            this.innerRad = this.rad * 0.9
            this.outerRad = this.rad * 1.2
            this.pieData.forEach((e, i) => {
                let slice = this.pieData[i]
                slice.isOpen ? this.openSlice(slice) : this.closeSlice(slice)
            })

        },
        closeChart() {
            this.innerRad = this.rad * 0.5
            this.outerRad = this.rad * 0.9
            this.pieData.forEach((e, i) => {
                let slice = this.pieData[i]
                slice.isOpen ? this.openSlice(slice) : this.closeSlice(slice)
            })
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
        enterSlice(d, i) {
            let index = d.index
            this.openSlice(this.pieData[index])
            this.$refs.pieSlice[index].setAttribute("fill", hsla(adjustHsl(d.data.color, { l: 15 })))
        },
        leaveSlice(d, i) {
            let index = d.index
            let data = this.pieData[index]
            if (!data.isOpen) {
                this.closeSlice(data)
                this.$refs.pieSlice[index].setAttribute("fill", d.data.color)
            }


        },
        clickSlice(d, i) {
            let index = d.index
            let data = this.pieData[index]
            if (data.isOpen) {
                this.closeChart()
            } else {
                this.openChart()
                this.$emit("sub", data)
            }
            this.pieData[index].d = this.arcOpen(d)
            this.pieData[index].isOpen = !this.pieData[index].isOpen
            this.currentLabel = data.data.label
            this.currentValue = data.data.value
            this.pieData.filter(e => (e.index != index && e.isOpen)).forEach(e => {
                this.pieData[e.index].isOpen = false
                this.closeSlice(this.pieData[e.index])
                this.$refs.pieSlice[e.index].setAttribute("fill", this.pieData[e.index].data.color)
                this.$el.querySelector("circle").setAttribute("fill", d.data.color)
            })
            let label = document.querySelector(".txtLabel")
            let labelBox = label.getBBox()
            let t = label.getAttribute("transform").match(/translate.*\)/i)[0].match(/(?<=,)(-?(\d+)?\.?(\d+)?)/ig)
            let h = t + labelBox.height
        },
    }

}
</script>
<template>
    <div class="svg-wrapper">
        <svg :viewBox="`0 0 ${width} ${height}`" xmlns="http://www.w3.org/2000/svg" id="dataChart">
            <g class="content" :transform="`translate(${width / 2},${height / 2})`">


                <g class="info">
                    <circle cy="0" cx="0" :r="(innerRad + (rad * 0.05))" />
                    <text text-anchor="middle" dominant-baseline="middle" :style="`font-size:${width * 0.08}`"
                        :transform="`translate(0,${(-width * 0.09) / 2})`" class="txtLabel">{{
                                currentLabel
                        }}</text>
                    <text text-anchor="middle" dominant-baseline="middle" :style="`font-size:${width * 0.05}`"
                        :transform="`translate(0,${(width * 0.04) / 2})`" class="txtValue">{{
                                currentValue
                        }}</text>
                </g>
                <g class="slices">
                    <template v-for="(val, index) in pieData" :key="index">
                        <path class="slice" :d="val.d" :fill="val.data.color" ref="pieSlice"
                            @mouseenter="enterSlice(val, i)" @mouseleave="leaveSlice(val, i)"
                            @click="clickSlice(val, i)">
                        </path>
                    </template>

                </g>

            </g>
        </svg>

    </div>
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
