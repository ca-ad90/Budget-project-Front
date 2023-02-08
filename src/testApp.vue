<script lang="js">
const { default: d3 } = await import("d3")
import { dbUrl } from "./db.config.js";
import { RouterLink, RouterView } from "vue-router";
import PieChart from "./components/PieChart.vue"
import ChartSvg from "./components/PieChartSvg.vue"
import { hsla, rgba, adjustHsl, changeHsl, rgbToHsl, hslToRgb } from "./utils/utilHsl.js"
export default {

    components: {
        RouterLink: RouterLink,
        RouterView: RouterView,
        "pie-chart": PieChart,
        "svg-chart": ChartSvg,
    },
    data() {
        return {
            hasSubChart: false,
            models: {
                selected: "",
                models: [
                    "accounts",
                    "transactions",
                    "categories",
                    "subcategories",
                ],
            },
            refs: {},
        };
    },

    watch: {
        models(oldValue, newValue) {
            console.log("old", oldValue);
            console.log("new", newValue);
        },
    },
    computed: {
        data() {
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
                "voluptate"
            ]
            let colors = [
                "#F0A202",
                "#E01A4F",
                "#F15946",
                "#202C59",
                "#53B3CB",
            ]
            let data = labels.map((e, i) => {
                let l = e
                let val = Math.floor(Math.random() * 100) * 10
                return { label: l, value: val, color: getColor(i, colors), open: false }
            })
            let pData = this.pie(data)
            return pData
        },
        pie() {
            return d3.pie().sort(null).value(d => d.value)
        },
        getSelectedModel() {
            c;
            return this.models.selected;
        },
    },
    methods: {
        linkTo() {
            this.$router.push("/" + this.models.selected);
        },
    },
};
</script>

<template>
    <svg-chart :_data="data"></svg-chart>

    <RouterView />
</template>

<style scoped>
header {
    line-height: 1.5;
    max-height: 100vh;
}

.logo {
    display: block;
    margin: 0 auto 2rem;
}

nav {
    width: 100%;
    font-size: 12px;
    text-align: center;
    margin-top: 2rem;
}

nav a.router-link-exact-active {
    color: var(--color-text);
}

nav a.router-link-exact-active:hover {
    background-color: transparent;
}

nav a {
    display: inline-block;
    padding: 0 1rem;
    border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
    border: 0;
}

@media (min-width: 1024px) {
    header {
        display: flex;
        place-items: center;
        padding-right: calc(var(--section-gap) / 2);
    }

    .logo {
        margin: 0 2rem 0 0;
    }

    header .wrapper {
        display: flex;
        place-items: flex-start;
        flex-wrap: wrap;
    }

    nav {
        text-align: left;
        margin-left: -1rem;
        font-size: 1rem;

        padding: 1rem 0;
        margin-top: 1rem;
    }
}
</style>
