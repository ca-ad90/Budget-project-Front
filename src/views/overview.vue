<script>
import { useDbConfig } from '../stores/dbConfig';
export default {
    setup() {
        const db = useDbConfig()
        return {
            db
        }
    },

}
</script>
<template>

</template>
