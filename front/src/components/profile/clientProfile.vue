<template lang="html">
    <div class="">
        <v-layout class="pa-4" justify-space-around>
            <h6 class="title primary--text">{{user[0].name}}</h6>
            <v-spacer></v-spacer>
            <v-btn color="warning" @click='logout()'><v-icon class="pr-3 pl-0">input</v-icon>logout</v-btn>
        </v-layout>


        <v-container fluid fill-height>
            <v-layout row wrap>
                <v-flex xs12 md3>
                    <v-card elevation-12>
                        <v-container grid-list-xs,sm,md,lg,xl>
                            <p class="sub_grey mb-1 mt-2">Nom</p>
                            <p class="subheading">{{user[0].name}}</p>
                            <v-divider></v-divider>

                            <p class="sub_grey mb-1 mt-2">Raison Social</p>
                            <p class="subheading mb-2">{{user[0].legalName}}</p>
                            <v-divider></v-divider>

                            <p class="sub_grey mb-1 mt-2">Address</p>
                            <p class="subheading mb-2">{{user[0].address}}</p>
                            <v-divider></v-divider>

                            <p class="sub_grey mb-1 mt-2">Email</p>
                            <p class="subheading mb-2">{{user[0].email}}</p>
                            <v-divider></v-divider>

                            <p class="sub_grey mb-1 mt-2">Téléphone</p>
                            <p class="subheading mb-2">{{user[0].phone}}</p>
                            <v-divider></v-divider>

                            <p class="sub_grey mb-1 mt-2">Siret</p>
                            <p class="subheading mb-2">{{user[0].siret}}</p>

                            <v-btn flat outline color="primary" class="ma-0 pa-0 mt-4 font13">
                             modifier mes informations
                            </v-btn>
                        </v-container>
                    </v-card>
                </v-flex>
                <v-flex xs12 md8 ml-5>
                    <v-card elevation-12>
                        <template>
                            <div>
                                <v-tabs
                                fixed-tabs
                                v-model="active"
                                slider-color="success">
                                    <v-tab>Commandes</v-tab>
                                    <v-tab>Factures</v-tab>
                                    <v-tab>Statistiques</v-tab>

                                    <v-tab-item>
                                        <template>
                                            <v-data-table
                                            :rows-per-page-items="[7,20, 50, 100]"

                                            :headers="headers"
                                            :items="clientOrders"

                                            class="elevation-1">
                                                <template slot="items" slot-scope="props">
                                                    <td class="text-xs-left">{{ props.item.createdDate| moment("l") }}</td>
                                                    <td class="text-xs-left">{{ props.item.date | moment("l") }}</td>
                                                    <td class="text-xs-left">{{ props.item.time }}</td>
                                                    <td><p v-for="item in props.item.productQuantity">{{item}} </p></td>
                                                    <td class="text-xs-left">{{Math.round(props.item.total * 100) / 100}} €</td>
                                                    <td class="text-xs-left">
                                                        <v-btn round color="primary ma-0 pa-0" small dark v-if=" props.item.status === 'ordered'">{{ props.item.status }}</v-btn>
                                                        <v-btn round color="accent ma-0 pa-0" small dark v-if=" props.item.status === 'pending'">{{ props.item.status }}</v-btn>
                                                        <v-btn round color="success ma-0 pa-0" small dark v-if=" props.item.status === 'done'">{{ props.item.status }}</v-btn>
                                                        <v-btn round color="error ma-0 pa-0" small dark v-if=" props.item.status === 'canceled'">{{ props.item.status }}</v-btn>
                                                    </td>
                                                </template>
                                                <template slot="pageText" slot-scope="props">
                                                  Lignes {{ props.pageStart }} - {{ props.pageStop }} de {{ props.itemsLength }}
                                                </template>
                                            </v-data-table>
                                        </template>
                                    </v-tab-item>

                                    <v-tab-item>
                                        <p>Factures</p>
                                    </v-tab-item>

                                    <v-tab-item>
                                        <p>Statistiques</p>
                                    </v-tab-item>
                                </v-tabs>
                            </div>
                        </template>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
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
            'clientOrders',
            'notification'
        ]),
    },

    created () {
        this.$store.dispatch('loadClientOrders', this.user[0].id)
    },

    data () {
        return {
            pagination: {
                rowsPerPage: 10
            },
            active: null,
            headers: [
                { text: 'Commandé le', value: 'orderDate'},
                { text: 'Pour le', value: 'date'},
                { text: 'heure', value: 'time'},
                { text: 'Contenu', value: 'products'},
                { text: 'prix', value: 'mail' },
                { text: 'statut', value: 'status' }
          ],
        }
    },

    props: ['id'],

    methods : {
        logout(){
            this.$store.dispatch('logout');
            window.location.replace("/");
        },
        setProductQuantity(){

            function toObject(arr) {
              var rv = {};
              for (var i = 0; i < arr.length; ++i)
                rv[i] = arr[i];
              return rv;
            }
        },

        //todo : put this function into mixins files...
        showNotif(){
            this.$notify({
              group: 'auth',
              type: this.notification.data.type,
              title: this.notification.data.type,
              duration: 2000,
              speed: 1000,
              text: this.notification.data.message
            });
        }
    },



    watch: {
       notification: function () {
            this.showNotif()
       }
     },
}
</script>

<style lang="css">
.sub_grey {
    color : #9A9A9A;
}

.font13 {
    font-size: 13px;
}
</style>
