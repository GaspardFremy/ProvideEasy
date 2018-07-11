<template lang="html">
    <div>
        <p>Affiché depuis le component 2, via le store : {{count.id}}</p>

        <v-btn @click="decrement">decrémenter</v-btn>

        <v-text-field
          name="name"
          label="label"
          value="value"
          single-line
          v-model='inputValDec'
        ></v-text-field>
    </div>

</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
    data(){
        return {
            inputValDec : ''
        }
    },
    computed: {
        ...mapGetters([
        'count'
        ])
    },
    methods: {
        ...mapActions([
        'decrement'
        ]),
    },
    decrementVal(){
        const payloaddec = Number(this.inputValDec)
        this.decrement(payloaddec)
    }
}
</script>
