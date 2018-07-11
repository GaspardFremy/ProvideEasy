<template lang="html">
    <div class="">
        <v-layout row wrap align-content-center>
            <h6 class="title primary--text pa-4 pl-1">Nouvelle Commande</h6>


        </v-layout>
    </div>

</template>

<script>
import Card from '@/components/order/card'
import draggable from 'vuedraggable'
import { mapGetters } from 'vuex'
import { mapState } from 'vuex'

export default {
    components: {
        'app-card' : Card,
        draggable
    },
    data(){
        return {
            orderName: null,
            showInput : false,
            checkbox: 0,
            date: null,
            time: null,
            menu: false,
            modal: false,
            menu1: false,
            menu2: false,
            drag: true,
            isActive: false,
            testapi:'' ,
            dialog1: false,
            dialog: false,
            truc: 0,
            productAmount: [
             0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20
            ]
        }
    },
    created () {
        this.$store.dispatch('loadProducts', 1)
    },
    computed: {
        ...mapState([
           'products'
        ]),
        ...mapGetters([
        'totalCart',
        ]),
        cart: {
            get() {
                return this.$store.state.cart
            },
            set(value) {
                // let id = (value[value.length-1].id);
                // console.log('id is :');
                // console.log(id);
                //Issue : after 5 product in cart, id loop itself
                this.$store.commit('setCart', value)
            }
        },
        products: {
            get() {
                return this.$store.state.products
            },
            set(value) {
                this.$store.commit('setProducts', value)
            }
        },
        dragOptions () {
           return  {
             animation: 0,
             group: {
                 name: 'panier',
                 pull: 'clone',
                 put: false,
               },
            };
         },
        getId(product) {
            console.log('ok');
        }
    },
    methods: {
        switchCategory(payload){
            this.$store.dispatch('loadProducts', payload)
        },

        appendProduct: function(value){
            console.log(value.quantity);
                this.$store.commit('setCartBySelect', value);
        },

        removed: function(index, productId) {
            let payload = {index, productId}
            this.$store.commit('removeProduct', payload)
        },

        onMove ({relatedContext, draggedContext}) {
            const relatedElement = relatedContext.element;
            const draggedElement = draggedContext.element;
            return (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
            console.log(draggedContext.element);
            console.log("ok");
        },

        checkMove: function(evt){
            return (evt.draggedContext.element.name!=='apple');
            console.log("ok");

        },

        // onEnd: function(evt){
        //     // console.log("new index :"),
        //     // console.log(evt),
        //     // console.log(this.cart),
        //     // console.log("id")
        //
        //     // console.log(evt.to.__vue__.el.__vue__.value[0].id)
        //
        //     // console.log(evt.to.__vue__.el.__vue__)
        //     //
        // },

        allowedDates: function allowedDates(val) {
            return ![1].includes(new Date(val).getDay());
        },
        takeOrder(payload){
            let order = {
                products : payload,
                clientId : 1,
                deadlineDate : this.date,
                deadlineTime : this.time,
                saved : this.checkbox,
                orderName : this.orderName
            }
            this.$store.commit('takeOrder', order)
        },
        cartIsNotEmpty(){
            return this.cart.length > 0 && this.date != null && this.time != null

        },
        getPic(imgURL) {
             return require('@/assets/products/' + imgURL + '.jpg')
        },

        getTotalTTC(total) {
            return Math.round( ((total * 5.5 / 100) + total ) * 100) / 100
        },

        getTotalReduc(total) {
            return Math.round((total - (total * 10/100)) * 100) / 100
        },


    },
     watch: {
       isDragging (newValue) {
         if (newValue){
           this.delayedDragging= true
           return
         }
         this.$nextTick( () =>{
              this.delayedDragging =false
         })
       }
    },

}
</script>

<style lang="css">
.card_info {
    color: #9A9A9A;
}

.input-group__details {
    display: none;
}

.input-group--select .input-group__selections {
    width: 20px;
}

.card__title{
    padding: 10px;
}

.card__title--primary{
    padding: 10px;
}

.btn--floating{
    height: 20px;
    width: 20px;
}

.products {
    /* min-width: 120%; */
}

.drag_here {
    border: 1px dashed #635BCF;
    padding: 10px;
    margin: 10px;
}

.product_card {
    min-width: 200px;
}

.category_icon {
    height: 20px;
}

.check label {
    font-size: 13px;
}

</style>
