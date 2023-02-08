<script>
import { dbUrl } from "/src/db.config.js";
export default {
    props: {
        value: { defalut: "" },
        inKey: { default: "" },
        index: { defalut: "" },
        n: { default: 0 }
    },
    beforeUpdate() {
        console.log("\n--------")
        console.log(this.value)
        console.log(Object.keys(this.value))
        console.log("--------\n")
    },
    data() {
        return {

        }
    },
    computed: {
        x() {
            return this.n + 1
        }
    }

};
</script>
<template>

    <div v-if="(typeof value == 'object' && typeof value !== null) " class="wrapper">
        <div v-if="value.length" class="array">
            <strong>{{inKey.substring(0,1).toUpperCase()+inKey.substring(1)}}:</strong>
            <template v-for="(v,i) in value" :key="i" class="inner array">
                <span v-if="typeof v =='object' && Object.keys(v).length == 1">{{Object.keys(v)[0]}} :
                    {{v[Object.keys(v)[0]]}}</span>
                <loop-component v-else :n="x" :value="v" :index="i"></loop-component>
            </template>
        </div>
        <div v-else class="">
            <strong v-if="inKey">{{inKey.substring(0,1).toUpperCase()+inKey.substring(1)}}:</strong>
            <div v-for="(v,k,i) in value" :key="k" class="inner object">
                <loop-component :n="x" :value="v" :inKey="k" :index="i"></loop-component>
            </div>
        </div>
    </div>
    <span v-else class="none-object">
        <strong v-if="inKey">{{inKey.substring(0,1).toUpperCase()+inKey.substring(1)}}:</strong> {{value}},
    </span>


</template>
<style scoped>
div {
    font-family: "Zilla Slab";
    font-size: 18px;
}

.object {
    padding-left: 15px
}

.wrapper .wrapper:last-child {
    border-bottom: 1px solid black;
}

dl,
dl dt,
dl dd {
    font-family: "Zilla-slab" !important;
    font-size: 18px;
}

dd {
    padding-left: 15px;
}

strong {
    font-weight: bold;
}
</style>
