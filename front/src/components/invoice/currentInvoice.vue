<template lang="html">
    <div>
        <h6 class="title primary--text pa-4">Current Invoice</h6>
        <v-layout row>
            <v-flex xs12 sm10 offset-sm1>
                <v-tabs
                dark
                color="info"
                show-arrows
                class="elevation-1">
                    <v-tabs-slider class="waring"></v-tabs-slider>
                    <v-tab
                    v-for="i in 30"
                    :key="i"
                    :href="'#tab-' + i">
                    Item {{ i }}
                    </v-tab>
                    <v-tabs-items>
                        <v-tab-item
                        v-for="i in 15"
                        :key="i"
                        :id="'tab-' + i">
                        <v-card flat>
                        <v-card-text>
                            <template>
                              <v-data-table
                                :headers="headers"
                                :items="values">
                                <template slot="items" slot-scope="props">
                                  <td>{{ props.item.name }}</td>
                                  <td>{{ props.item.amount }}</td>
                                  <td>{{ props.item.price }}</td>
                                  <td>{{ getTotalRow }}</td>
                                </template>
                                <template slot="footer">
                                 <td colspan="100%">
                                     <table class="mt-5">
                                         <tr>
                                            <td><span>PRIX TOTAL HT : </span></td>
                                            <td><span class="subtitle pl-1">10 €</span></td>
                                          </tr>
                                          <v-spacer class="mt-1"></v-spacer>
                                          <tr>
                                             <td><span>PRIX TTC <br> (TVA 5,5%) : </span></td>
                                             <td><span class="subtitle pl-1"> 10,55 €</span></td>
                                           </tr>
                                           <v-spacer class="mt-1"></v-spacer>
                                          <tr>
                                             <td><span class="mt-1">APRÈS - 10% : </span></td>
                                             <td><span class="title pl-1">9,40 €</span></td>
                                           </tr>
                                     </table>
                                 </td>
                               </template>
                              </v-data-table>
                            </template>
                        </v-card-text>
                        </v-card>
                        </v-tab-item>
                    </v-tabs-items>
                </v-tabs>
            </v-flex>
        </v-layout>
    </div>
</template>

<script>
  export default {
    data () {
      return {
          headers: [
          {
            text: 'Total/day',
            align: 'left',
            sortable: false,
            value: 'name'
          },
          { text: 'Amount', value: 'amount' },
          { text: 'Unit Price', value: 'price' },
          { text: 'Total', value: 'total' },
        ],
        values: [
            {
                value: false,
                name: 'Baguette',
                price: 1,
                amount: 6,
                total: 9
            },
            {
                value: false,
                name: 'Baguette tradition',
                price: 1.2,
                amount: 20,
                total: 9
            }
        ]
      }
    }
  }
</script>
