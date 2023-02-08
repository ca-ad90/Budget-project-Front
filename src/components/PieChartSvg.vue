<script lang="js">
import { is } from "@babel/types"
import { hsla, rgba, adjustHsl, changeHsl, rgbToHsl, hslToRgb } from "../utils/utilHsl.js"
import Slices from "./PieChartSlices.vue"
import { useDbConfig } from "../stores/dbConfig";

const { default: d3 } = await import("d3")

export default {
    setup() {
        const db = useDbConfig()
        return { db }
    },
    components: {
        "pie-slices": Slices
    },
    props: {
        _data: {
            type: Array //[{label:,value:}]
        },
        _size: {
            default: 500
        },
    },
    created() {
        this.$data.width = this._size
        this.$data.height = this._size
        this.$data.size = this._size
        this.$data.rad = this._size / 2
        this.$data.cRad = this.$data.rad * 0.45
        this.$data.hasSubChart = false
        this.$data.subEnter = 0



    },
    data() {
        return {
            currentLabel: "",
            currentValue: "",
            selectedIndex: null,
            width: 0,
            height: 0,
            size: 0,
            topOpen: false,
            selectedSub: null,
            subData: {},
            subEnter: 0,
        }
    },
    computed: {
        pie() {
            return d3.pie().sort(null).value(d => d.value)
        },
        pieData() {
            let colors = [
                "#F0A202",
                "#E01A4F",
                "#F15946",
                "#202C59",
                "#53B3CB",
                "#FF4E00",
                "#8EA604",
                "#F5BB00",
                "#EC9F05",
                "#BF3100",
                "#011936",
                "#465362",
                "#82A3A1",
                "#9FC490",
                "#C0DFA1",
            ]
            let data = this.$props._data.map((e, i) => {
                e.color = colors[i]
                return e
            })
            data = this.pie(data)
            return data

        },
        currentSubData() {
            if (this.selectedSub === null) return false
            return this.subData[this.selectedSub]
        }

    },
    methods: {

        getColor(index) {
            let clr = this.colors[index % this.colors.length]
            let dif = Math.floor(index / this.colors.length)
            let color = adjustHsl(rgbToHsl(clr), { h: 20 * dif })
            return hsla(color)
        },
        getData(inData) {
            function getColor(index, colors) {
                let clr = colors[index % colors.length]
                let dif = Math.floor(index / colors.length)
                let color = adjustHsl(rgbToHsl(clr), { h: 20 * dif })
                return hsla(color)
            }
            let labels = [
                "Lorem",
                "ipsum",
                "dolor",
                "incididunt",
                "fugiat",
                "voluptate",
                "excepteur",
                "occaecat",
                "minim",
                "officia",
                "pariatur",
                "voluptate",
            ]
            let colors = [
                "#F0A202",
                "#E01A4F",
                "#F15946",
                "#202C59",
                "#53B3CB",
                "#FF4E00",
                "#8EA604",
                "#F5BB00",
                "#EC9F05",
                "#BF3100",
                "#011936",
                "#465362",
                "#82A3A1",
                "#9FC490",
                "#C0DFA1",
            ]
            let data = []
            console.log('this.propData', this.propData);
            if (inData) {
                console.log(inData)
                data = inData.map((e, i) => {
                    e.color = colors[i]
                    return e
                })
            } else {
                while (data.length < 7) {
                    function rand() {
                        let i = Math.floor(Math.random() * labels.length)
                        let l = labels[i]
                        if (data.findIndex(e => e.label == l) != -1) {
                            return rand()
                        } else {
                            return i
                        }
                    }
                    let i = rand()
                    let l = labels[i]
                    let val = Math.floor(Math.random() * 100) * 10
                    data.push({ label: l, value: val, color: getColor(i, colors) })
                }
            }
            console.log("data", data)
            let pData = this.pie(data)
            return pData
        },
        hoverCircle() {
            this.cRad = this.rad * 0.4
        },
        async openSubChart(payload) {

            if (payload.isOpen) {
                this.subEnter = 0
                console.log("close")
                this.topOpen = false
                this.selectedSub = null
                this.cRad = this.rad * 0.4
                return

            }
            this.topOpen = true
            this.cRad = this.rad * 0.4
            this.subEnter = 1
            if (!this.subData.hasOwnProperty(payload.data.label)) {
                console.log(this.subData)
                let subData = await this.db.getQuery("transaction/group/subcategory", { category: payload.data.label })
                let data = []
                console.log('subData', subData);
                for (let d in subData.data) {
                    data.push({ label: d, value: subData.data[d].amount * -1 })
                }

                let s = 0
                let l = 0
                data = this.pie(data)
                data = data.map((e, i) => {

                    l = 5 * i
                    console.log(l)

                    let c = adjustHsl(payload.data.color, { l: l })
                    console.log(c)
                    c[2] = Math.min(Math.max(c[2], 10), 100)
                    e.data.color = hsla(c)
                    return e

                })
                console.log("outData", data)
                this.subData[payload.data.label] = data
            }
            this.selectedSub = payload.data.label
            console.log(this.currentSubData)

        },
        hoverslice(payload) {
            this.$el.querySelector("circle").style.fill = payload.color
            this.currentLabel = payload.label
            this.currentValue = payload.value
            console.log(payload, payload.name)
            if (this.selectedSub && payload.name == "main") {
                this.cRad = this.rad * 0.7
            }
        },
        svgClick(e) {
            if (e.target.classList.contains("chartSvg")) {
                this.subEnter = 0
                console.log("close")
                this.topOpen = false
                this.selectedSub = null
                this.cRad = this.rad * 0.4
                return
            }
        }
    }

}
</script>
<template>
    <div class="svg-wrapper">
        <svg :viewBox="`0 0 ${width} ${height}`" xmlns="http://www.w3.org/2000/svg" class="chartSvg"
            v-on:click="svgClick($event)">
            <g class="content" :transform="`translate(${width / 2},${height / 2})`">

                <pie-slices :_data="pieData" :_size="size" :_open="topOpen" @hoverSlice="hoverslice"
                    @sliceClick="openSubChart">
                </pie-slices>
                <g class="sub" :transform="`scale(${subEnter},${subEnter})`">
                    <pie-slices v-if="currentSubData" :_data="subData[selectedSub]" :_size="size" _name="sub"
                        :key="selectedSub" @hoverSlice="hoverslice">
                    </pie-slices>
                </g>

                <g class="info">
                    <circle :r="cRad" @mouseover="hoverCircle" />
                    <text text-anchor="middle" dominant-baseline="middle" :style="`font-size:${width * 0.08}`"
                        :transform="`translate(0,${(-width * 0.09) / 2})`" class="txtLabel">{{
                                currentLabel
                        }}</text>
                    <text text-anchor="middle" dominant-baseline="middle" :style="`font-size:${width * 0.05}`"
                        :transform="`translate(0,${(width * 0.04) / 2})`" class="txtValue">{{
        currentValue
                        }}</text>
                </g>
            </g>

        </svg>

    </div>
</template>
<style>
.svg-wrapper {
    position: relative;
    height: 40vh;
}

svg {
    height: 100%;
    width: 100%
}

g {
    transition: 0.3s;
}

circle {
    transition: 0.3s
}

path.slice {
    transition: 0.3s;
}

circle {
    fill: transparent
}
</style>
