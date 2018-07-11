<template lang="html">
    <div>
        <v-container>
            <h6 class="title primary--text">Page test</h6>
            <p class="pa-2">Afficher des données depuis le store dans deux composants différents</p>


            <p>affiché directement depuis le store : {{count.id}}</p>

            <component1></component1>
            <hr class="ma-5">
            <component2></component2>

        </v-container>
    </div>

</template>

<script>
import Component1 from '@/components/test/component1';
import Component2 from '@/components/test/component2';

import { mapGetters, mapActions } from 'vuex'

export default {
    components: {
        'component1' : Component1,
        'component2' : Component2

    },
    computed: {
        ...mapGetters([
        'count'
        ])
    }
}

</script>
