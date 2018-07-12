<template lang="html">
    <div>
        <h6 class="title primary--text pa-4">Invoices Board</h6>
        <v-container fluid fill-height>
            <v-layout row justify-space-between>
                <v-flex xs12>
                    <v-data-table
                      :headers="headers"
                      :items="clients"
                      hide-actions
                      class="elevation-2 text-xs-center" >
                      <template slot="items" slot-scope="props">
                        <td class="text-xs-left">{{ props.item.name }}</td>
                        <td class="text-xs-left">{{ props.item.ab }}</td>
                        <td class="text-xs-left">{{ props.item.revenues }}</td>
                        <td class="text-xs-left">
                            <v-btn round color="success" small dark v-if=" props.item.invoice === 'paid'">{{ props.item.invoice }}</v-btn>
                            <v-btn round color="warning" small dark v-if=" props.item.invoice === 'pending'">{{ props.item.invoice }}</v-btn>
                            <v-btn round color="error" small dark v-if=" props.item.invoice === 'late'">{{ props.item.invoice }}</v-btn>
                       </td>
                      </template>
                    </v-data-table>
                </v-flex>
            </v-layout>
        </v-container>
        <v-container fluid fill-height>
            <v-layout row>
                <v-flex xs3>
                    <pieChart/>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>

import pieChart from './charts/pieChart'
import { mapGetters } from 'vuex'

export default {

    name: 'VueChartJS',


    components: {
      pieChart
    },


    computed: {
        ...mapGetters([
        'clients'
        ])
    },


    data: () => ({
      dialog: false,
      headers: [
        { text: 'Name', value: 'name'},
        { text: 'Average Basket', value: 'ab' },
        { text: 'Revenues(this m)', value: 'revenues' },
        { text: 'last invoice', value: 'invoice'}
      ],
    })
  }
</script>
