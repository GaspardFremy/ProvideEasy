<template lang="html">
    <div>
        <p>Affiché depuis le component 1, via le store : {{count.id}}</p>

        <v-btn @click="incrementVal">Incrémenter</v-btn>

        <v-text-field
          name="name"
          label="label"
          value="1"
          single-line
          v-model="inputVal"
        ></v-text-field>


    </div>

</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
    computed: {
        ...mapGetters([
        'count'
        ]),
    },
    methods: {
        ...mapActions([
        'increment'
    ]),
    incrementVal(){
        const payload = Number(this.inputVal)
        this.increment(payload)
    }
    },
    data(){
        return {
            inputVal : ''
        }
    }
}
</script>
