<template lang="html">
    <div class="">
        <h6 class="title primary--text pa-4">{{user[0].name}}</h6>
        <v-btn color="warning" @click='logout()'><v-icon class="pr-3 pl-0">input</v-icon>logout</v-btn>
    </div>
</template>

<script>

import { mapGetters } from 'vuex'
import { mapState } from 'vuex'

export default {

    computed: {
        ...mapState([
            'user',
        ]),
        ...mapGetters([
            'user',
        ])
    },

    data () {
        return {
            user : this.$store.getters.user
        }
    },

    props: ['id'],

    methods : {
        logout(){
            this.$store.dispatch('logout');
            window.location.replace("/");
        },
    },
}
</script>

<style lang="css">
</style>
