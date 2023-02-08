<script>
import { dbUrl } from "../db.config.js";
import editText from "../components/textChange.vue";
export default {
    components: {
        "edit-text": editText,
    },
    refs: {
        path: {
            type: String,
            required: true,
        },
    },
    created() {
        this.getDocuments();
        this.$watch(
            () => (this.$route.params ? this.$route.params : "disabled"),
            () => {
                this.getDocuments();
            }
        );
    },
    computed: {
        params() {
            this.$route.params ? this.$route.params : "disabled";
        },
    },
    data() {
        return {
            baseUrl: dbUrl,
            documents: [],
            loaded: true,
            newDocuments: [],
        };
    },
    methods: {
        getDocuments() {
            this.documents = [];
            this.loaded = false;
            fetch(this.baseUrl + this.$route.params.model)
                .then((res) => {
                    let out;
                    try {
                        out = res.json();
                    } catch (e) {
                        console.log("FIELD ERROR");
                        console.log(res);
                    }

                    return out;
                })
                .then((data) => {
                    console.log(data);
                    data = data.map(e => {
                        for (let f in e) {
                            console.log(e, f)
                            if (e[f] && e[f].hasOwnProperty("name") && e[f].hasOwnProperty("_id")) {
                                e[f] = e[f].name
                            }
                        }
                        return e
                    })
                    this.documents = data;
                    this.newDocuments = data;
                    console.log("documents", this.documents);
                    this.loaded = true;
                });
        },
        setData(index, key, val) {
            console.log("\n---", val)
            console.log("\n---", key)
            console.log("\n---", index)
            console.log(this.newDocuments);
            console.log(this.documents);
            if (key > 5 || this.documents.length > 6) {
                debugger
            }
            this.documents[index][key] = val;
            console.log(this.newDocuments);
            console.log(this.documents);
        },
    },
};
</script>

<template>
    <div class="document-container">
        <div class="document-item" style="
            display: flex;
            flex-flow: row wrap;
            column-gap: 15px;
            justify-content: flex-start;" v-for="(v, i) in documents" :key="v._id">
            <template v-for="(val, key,index) in v" :key="v._id + key">
                <div v-if="key.substring(0,1) != '_' " style="
                    display: flex;
                    flex-flow: column wrap;
                    padding: 0;
                    margin-bottom:20px;
                " :f-val="val" :f-index="index" :f-v="JSON.stringify(v)" :f-i="i">
                    <h3 :f-key="JSON.stringify(key)" style="margin-bottom: 0">
                        {{ key }}
                    </h3>
                    <p v-if="key.substring(0,1) != '_' ">
                        <edit-text :id="'inp'+key+val" @closed="
                            (value) => {
                                setData(i, key, value);
                            }
                        ">
                            {{ val }}
                        </edit-text>
                    </p>
                </div>
            </template>


            <p>
                <input type="hidden" v-for="(val, key, index) in v" :key="key + index + v.id"
                    v-model="documents[i][key]" />
            </p>
        </div>
    </div>
</template>
