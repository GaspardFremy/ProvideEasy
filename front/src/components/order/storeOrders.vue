<template lang="html">
    <div class="">
        <v-layout row wrap class="maxheight">
            <v-flex xs3 class="cards_order success">
                    <v-card class="ma-2" v-for="order in orders">
                        <v-container @click='displayOrder(order.OrderId);displayOrderDetails(order); selected = order;' v-bind:class="{ selected: selected == order, 'ordered' : order.status == 'ordered' }">
                            <p class="title text-xs-center">{{order.clientName}}</p>
                            <p class="subheading ma-0">{{order.Date | moment("calendar").split(" à")[0]}}</p>
                            <p class="subheading">À {{order.Time}}</p>
                            <p>Commande n° {{order.OrderId}}</p>
                        </v-container>
                    </v-card>
            </v-flex>

            <v-flex xs9>
                <p v-if="!orderLoaded" class="headline pa-5">Cliquez sur une commande pour voir son contenu</p>
                <v-flex xs12>

                    <v-layout align-center justify-center row fill-height class="ma-5">
                        <v-container v-if="typeof(orderDetails) == 'object'">
                            <p class="text-xs-center headline pt-4">{{orderDetails.clientName}}</p>
                            <p class="headline ma-0 pt-2"> Pour le :  {{orderDetails.Date}}</p>
                            <p class="headline ma-0 pt-1">A : {{orderDetails.Time}}</p>
                            <p>{{orderDetails.orderId}}</p>

                            <p class="pt-3">Détail</p>

                            <div class="order-container" mx-auto v-for="article in orderedProducts">
                                <v-layout align-content-space-between>
                                    <p class="subheading">{{article.name}}   x</p>
                                    <p class="subheading">&nbsp;  {{article.ProductQuantity}}</p>
                                </v-layout>
                            </div>

                            <transition name="fade" mode="out-in">
                            <v-btn v-if='orderDetails.status === "ordered"' key="1"  color="success" class="ma-0 mt-4"  @click='switchStatus(orderDetails.OrderId, "pending")'>ACCEPTER LA COMMANDE</v-btn>
                            <v-btn v-if='orderDetails.status === "pending"' key="2" color="info" class="ma-0 mt-4"  @click='switchStatus(orderDetails.OrderId, "done"), emptyOrderDetails()'><v-icon class="category_icon pr-3 pl-0">done</v-icon>COMMANDE TERMINÉE</v-btn>
                            </transition>
                        </v-container>
                    </v-layout>


                </v-flex>
            </v-flex>
        </v-layout>


    </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {


    computed : {
        ...mapGetters([
            'orders',
            'orderedProducts',
            'notification'
        ]),
    },


    created () {
        this.$store.dispatch('loadOrders')
    },


    data(){
        return{
            orderLoaded : false,
            selected : true,
            orderDetails : '',
        }
    },


    methods : {

        displayOrder(orderId){
            this.$store.dispatch('loadOrderedProducts', orderId),
            this.orderLoaded = true
        },

        loadOrders() {
            this.$store.dispatch('loadOrders')
        },

        displayOrderDetails(order) {
            this.orderDetails = order
        },

        switchStatus(orderId, newStatus) {
            this.$store.dispatch('switchStatus', {orderId, newStatus });
        },

        emptyOrderDetails(){
            this.orderDetails = ''
        },
        //todo : create a mixins and put showNotif()
        showNotif(){
            this.$notify({
              group: 'auth',
              type: this.notification.data.type,
              title: this.notification.data.type,
              duration: 2000,
              speed: 1000,
              text: this.notification.data.message
            });
        },
    },


    watch: {
        notification: function () {
            this.showNotif()
        }
    },
}

</script>

<style>
    .maxheight {
        min-height: 100%;
    }
    .cards_order {
        border-right: 1px solid black;
        height:100vh;
        left: 0;
        right: 0;
        overflow-y: scroll;
    }

    .order-container {
        max-width: 500px;
    }

    .selected {
        -webkit-transition: 0.2s ease-out;
        background-color: #C8E9FB;
        transform: scale(1.02);
        -webkit-box-shadow: 1px 4px 18px 5px rgba(0,0,0,0.25);
        -moz-box-shadow: 1px 4px 18px 5px rgba(0,0,0,0.25);
        box-shadow: 1px 4px 18px 5px rgba(0,0,0,0.25);
    }

    .grow { transition: all .2s ease-in-out; }
    .grow:hover {  }

    .ordered {
        animation: blink_notif 2s infinite;
        color : white;
    }

    @keyframes blink_notif {
        0%   {background-color: #2196F3;}
        50%  {background-color: #36B47B;}
        100% {background-color: #2196F3;}
    }
</style>
