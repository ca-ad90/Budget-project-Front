<script>
import { dbUrl } from "/src/db.config.js";
export default {
    async beforeCreate() {
        console.log("init beforeCreate")

    },
    data() {
        return {
            stuff: "accounts",
            info: { accounts: null, transactions: null },
            res: {},
        };
    },
    computed: {
        options() {
            console.log("computed", this.info)
            return Object.keys(this.info);
        },
    },

    methods: {
        async getData() { },
        async sendArray(n) {
            let sendData = [];
            let next = false;
            console.log(this.info)
            let a = this.info[this.stuff][n];
            let body = JSON.stringify(a);
            console.log("body", body);
            return fetch(dbUrl + this.stuff, {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify(a),
            })
                .then((res) => res.json())
                .then(async (data) => {
                    sendData = data;
                    next = true;
                    console.log("data", data);
                    n++;
                    if (n < this.info[this.stuff].length) {
                        return new Promise(async res => {
                            res([sendData].concat(await this.sendArray(n)));

                        })
                    } else {
                        return new Promise(async res => { res([sendData]) });
                    }
                })

        },
        async sendStuff() {
            console.log("init fetch func");
            let arr = await this.sendArray(0);
            console.log("sendstuff, awaitarr", arr, this.stuff)
            this.res[this.stuff] = arr;
        },
        async deleteAll() {
            fetch(dbUrl + this.stuff, {
                method: "DELETE"
            }).then(res => res.json()).then(data => {
                this.res = {}
                console.log("delete", data)
            })
        }
    },
};
</script>
<template>
    <div class="component container">
        <div class="input container">
            <select name="stuff" id="select-stuff" v-model="stuff">
                <option v-for="(v, i) in options" :key="i" :value="v" :seleted="i == 0">
                    {{ v.substring(0, 1).toUpperCase() + v.substring(1) }}
                </option>
            </select>
            <button id="sendStuff" @click="sendStuff()">SendStuff</button>
            <button id="sendStuff" @click="deleteAll()">Delete All</button>
        </div>
        <div class="jsondata">
            <h2 class="flex-break">
                {{ stuff.substring(0, 1).toUpperCase() + stuff.substring(1) }}
            </h2>
            <div class="data data-cont">
                <div class="data-info" v-for="(val, index) in info[stuff]" :key="index">
                    <p v-for="(v, k) in val" :key="index + k">
                        <strong>{{ k }}:</strong> {{ v }}
                    </p>
                </div>
            </div>
            <div class="resp data-cont">
                <div class="data-info" v-for="(val, index) in res[stuff]" :key="index">
                    <p v-for="(v, k) in val" :key="index + k">
                        <strong>{{ k }}:</strong> {{ v }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
div {
    margin: 0;
    padding: 0;
    display: flex;
}

.jsondata {
    border: 1px solid black;
    padding: 20px;
    display: flex;
    flex-flow: row wrap;
    gap: 20px;
}

.data-cont {
    border: 1px solid black;
    flex: 1 0 40%;
    flex-flow: column wrap;
    gap: 20px;
}

.data-info {
    flex-flow: column wrap;
}

.data-info p {
    margin: 0;
    padding: 0;
}

.container {
    border: 1px solid black;
    padding: 20px;
}

.component {
    width: 100%;
    row-gap: 20px;
    flex-flow: column;
}

.input {
    flex-flow: column;
}

h2 {
    text-align: center;
}

.flex-break {
    flex: 0 0 100%;
    min-width: 100%;
}
</style>
