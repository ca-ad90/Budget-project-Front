<script>
import { dbUrl } from "../db.config.js";
import { useDbConfig } from "../stores/dbConfig.js"
export default {
    setup() {
        const db = useDbConfig()
        return {
            db
        }
    },
    created() {
        console.log(this.baseUrl, this.path);
    },
    watch: {
        data() {
            console.log("input watch");
        },
    },
    props: {
        path: {
            type: String,
            required: true,
        },
        refs: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            baseUrl: dbUrl,
            data: [],
            loading: true,
            fields: [],
            subcategory: [],
        };
    },
    computed: {
        inputFields() {
            console.log(this.fields)
            let inpFields = [];
            for (let field of this.fields) {
                let inp = {};
                console.log(field.type, field.type == "Date");
                let type =
                    field.type == "Date"
                        ? "date"
                        : field.type == "ObjectID"
                            ? "select"
                            : "text";
                inp = {
                    type: type,
                    name: field.name,
                };
                inpFields.push(inp);
            }
            console.log(inpFields);

            return inpFields;
        },
    },
    methods: {
        getRefs() {
            fetch(dbUrl + "refs")
                .then((res) => {
                    let out;
                    try {
                        out = res.json();
                    } catch (e) {
                        console.log("REFS ERROR");
                        console.log(res);
                    }
                    return out;
                })
                .then((data) => {
                    for (let m of data) {
                        this.refs[m.model] = m.options;
                    }
                });
        },
        getSubCat(id) {
            this.subcategory = [];
            fetch(this.baseUrl + "categories/" + id)
                .then((res) => res.json())
                .then((data) => {
                    this.subcategory = data.subcategories.map(e => e.name);
                    console.log("subcats", data);
                });
        },
        formatData() {
            let body = {};
            for (let k in this.data) {
                if (k.indexOf("_") > -1) {
                    continue;
                }
                console.log(this.fields, k);
                if (this.fields.filter((e) => e.name == k)[0].type == "Array") {
                    body[k] = this.data[k].split(/;|,/g);
                } else {
                    body[k] = this.data[k];
                }
            }

            fetch(this.baseUrl + this.path, {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify(body),
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log(data);
                });
        },
    },
};
</script>

<template>
    <div class="input-container">
        <label v-for="(v, i) in inputFields" :key="i">
            <template v-if="v.name != 'subcategory' || path == 'categories'">
                {{ v.name }}
                <template v-if="v.type == 'select'">
                    <select v-model="data[v.name]" @change="getSubCat(data[v.name])">
                        <option v-for="(val, index) in refs[v.name]" :key="index" :value="val.id">
                            {{ val.name }}
                        </option>
                    </select>
                </template>

                <input v-else :type="v.type" :name="v.name" v-model="data[v.name]" />
            </template>
        </label>
        <label v-if="subcategory.length > 0">
            subcategory
            <select v-model="data['subcategory']">
                <option v-for="(v, i) in subcategory" :key="i" :value="v">
                    {{ v }}
                </option>
            </select>
        </label>
        <button @click="formatData()">Skapa ny</button>
    </div>
</template>

<style scoped>
label {
    display: block;
    margin: 10px;
}

input,
select {
    display: block;
    min-width: 100px;
}

.input-container {
    display: flex;
    flex-flow: row wrap;
}

h1 {
    font-weight: 500;
    font-size: 2.6rem;
    top: -10px;
}

h3 {
    font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
    text-align: center;
}

@media (min-width: 1024px) {

    .greetings h1,
    .greetings h3 {
        text-align: left;
    }
}
</style>
