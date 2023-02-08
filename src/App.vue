<script>
import { dbUrl } from "./db.config.js";
import { RouterLink, RouterView } from "vue-router";
import Inputs from "./components/Inputs.vue";
import Stuff from "./components/SendStuff.vue";
import { useDbConfig } from "./stores/dbConfig";
import { hsla, rgba, adjustHsl, changeHsl, rgbToHsl, hslToRgb } from "./utils/utilHsl.js"
import PieChart from "./components/PieChart.vue"
export default {
    setup() {
        const db = useDbConfig()

        return { db }
    },
    components: {
        RouterLink: RouterLink,
        RouterView: RouterView,
        "input-fields": Inputs,
        "send-stuff": Stuff,
    },
    data() {
        return {
            baseUrl: dbUrl,
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
    <header>
    </header>
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
