import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VuexPersist from 'vuex-persist';


const $axios = 'http://localhost:3000';

Vue.use(Vuex)
Vue.use(VueAxios, axios)

const vuexLocalStorage = new VuexPersist({
  key: 'vuex',
  storage: window.localStorage,
  reducer: (state) => ({
      user: state.user,
      clients : state.clients
  }),
})

export const store = new Vuex.Store({
    state: {
        count : {id: 100},
        clientss: [
            {
                name: 'Théâtre de l\'Oeuvre',
                phone: '0761443112',
                adresse: '159 rues de Clichy',
                ab: 20,
                revenues: 600,
                invoice: 'pending',
                id: '1'
            },
            {
                name: 'Le Béguin',
                phone: '0761443112',
                adresse: '23 Impasse de mes couilles',
                ab: 12,
                revenues: 289,
                invoice: 'paid',
                id: '2'
            },
            {
                name: 'L\'Etincelle',
                phone: '0761443112',
                adresse: '33 rue Blanche',
                ab: 24,
                revenues: 1200,
                invoice: 'late',
                id: '3'
            },
            {
                name: 'Chez Papa',
                phone: '0761443112',
                adresse: '78 rue de Clichy',
                ab: 12,
                revenues: 989,
                invoice: 'paid',
                id: '4'
            },
            {
                name: 'Le Vaisseau Vert',
                phone: '0761443112',
                adresse: '159 rue de Clichy',
                ab: 20,
                revenues: 600,
                invoice: 'pending',
                id: '5'
            },
            {
                name: 'Le déjeuner sur l\'herbe',
                phone: '0761443112',
                adresse: '23 Impasse de mes couilles',
                ab: 12,
                revenues: 289,
                invoice: 'paid',
                id: '6'
            },
            {
                name: 'Bourgogne Sud',
                phone: '0761443112',
                adresse: '33 rue Blanche',
                ab: 24,
                revenues: 1200,
                invoice: 'late',
                id: '7'
            }
        ],
        clients : [ ],
        logErr : [ ],
        user : [ ],
        cart : [ ],
        products: [ ],
        orders : [ ],
        orderedProducts : [ ],
        orderDetails : [ ],
        savedOrders : [ ],
        invoices : [
            {
                id: '1',
                clientName: 'Art Bistro',
                Amount: 873,
                status: 'late',
                createdDate: '16/02/2018',
                deadline: '16/03/2018',
                payementTool: 'none',
                paidDate: 'null'
            },
            {
                id: '12',
                clientName: 'Le béguin',
                Amount: 773,
                status: 'done',
                createdDate: '16/02/2018',
                deadline: '16/03/2018',
                payementTool: 'check',
                paidDate: '19/02/2018'
            },
            {
                id: '123',
                clientName: 'Chez Papa',
                Amount: 820,
                status: 'pending',
                createdDate: '16/02/2018',
                deadline: '16/03/2018',
                payementTool: 'none',
                paidDate: 'null'
            },
            {
                id: '124',
                clientName: 'Le déjeuner sur l\'Herbe',
                Amount: 120,
                status: 'done',
                createdDate: '16/02/2018',
                deadline: '16/03/2018',
                payementTool: 'stripe',
                paidDate: '28/02/2018'
            }
        ],
        notification : [ ],
    },
    mutations: {
        // CLIENT NEW ORDER
        setCartBySelect: (state, value) => {
            console.log(value.id);

            let existingProduct = state.cart.find(function (obj) { return obj.id === value.id; });

            if (existingProduct){
                value.quantity++;
            }else {
                state.cart.push(value);
            }
        },
        setCart: (state, value) => {
            //First check if product is allready in cart.
            let productId = value[value.length-1].id;

            var existingProduct = state.cart.find(function (obj) { return obj.id === productId; });
            //If so, iterate quantity
            if (existingProduct){
                existingProduct.quantity++;
            }
            //If not, set it with quantity = 1
            else {
                value[value.length-1].quantity = 1
                state.cart = value
            }
		},
        setProducts: (state, value) => {
            state.products = state.products
        },
        removeProduct: (state, payload) => {
			state.cart.splice(payload.index, 1);
            let productIndex = state.products.findIndex(x => x.id === payload.productId);
            state.products[productIndex].quantity = 0;
		},
        SET_PRODUCTS (state, products) {
         state.products = products
         },

        takeOrder ({ commit }, order) {
        axios
            .post('http://localhost:3000/orders/new', {
            order: order
            })
            .then(function (response) {
            console.log('order taken ! : ');
            console.log(response);
            })
            .catch(function (error) {
            console.log(error);
         });
        },

        // CLIENT SAVED ORDERS
        SET_SAVED_ORDERS (state, savedOrders) {
            state.savedOrders = savedOrders
        },

        // STORE ORDERS
        SET_STORE_ORDERS (state, orders) {
         state.orders = orders
         },

        SET_ORDER_DETAILS (state, orderedProducts) {
         state.orderedProducts = orderedProducts

         },

         SET_NOTIF (state, notifInfo) {
          state.notification = notifInfo
         },

         RESET_NOTIF (state) {
            state.notification = null
        },

        //STORE's CLIENTS
        SET_CLIENTS (state, clients) {
            state.clients = clients
        },

         // AUTH SYSTEM
         SET_USER (state, userInfo) {
             state.user = userInfo
         },

         CLEAR_ERR (state) {
             state.logErr = null
         },

         SET_LOGERR (state, logErr) {
             state.logErr = logErr
         },

         LOGOUT (state) {
             state.user = []
         }
    },

    actions: {
        //STORE NEW CLIENT
        submitNewClient({commit}, clientInfo) {
            axios
                .post('http://localhost:3000/users/new/client', {
                clientInfo: clientInfo
                })
                .then(function (response) {
                commit('SET_NOTIF', response);
                // commit('RESET_NOTIF', response);
                })
                .catch(function (error) {
                console.log(error);
             });
        },

        // CLIENT NEW ORDER
        loadProducts ({ commit }, payload) {
        axios
            .get( $axios + '/products/' + payload)
            .then(r => r.data)
            .then(products => {
            commit('SET_PRODUCTS', products)})
        },

        // CLIENT SAVED ORDERS
        loadSavedOrders ({ commit }, payload) {
            axios
                .get( $axios + '/orders/saved/' + payload)
                .then(r => r.data)
                .then(savedOrders => {
                commit('SET_SAVED_ORDERS', savedOrders)})
        },

        // STORE ORDERS
        loadOrders ({ commit }) {
            axios.get('http://localhost:3000/orders/').then((response) => {
                commit('SET_STORE_ORDERS', response.data)})
        },

        loadOrderedProducts ({ commit }, orderId) {
            axios.get('http://localhost:3000/orders/' + orderId).then((response) => {
                commit('SET_ORDER_DETAILS', response.data)})
        },
        switchCategory({commit, dispatch}, payload) {
            let id = payload.orderId;
            // let newCategory = payload.newCategory
            axios
                .patch('http://localhost:3000/orders/changestatus', {
                order: payload
                })
                .then(function (response) {
                commit('SET_NOTIF', response);
                dispatch('loadOrders', {root: true});
                })
                .catch(function (error) {
                console.log(error);
             });


        },


        // STORE's CLIENT
        loadClients ({ commit }) {
            axios.get('http://localhost:3000/users/clients/').then((response) => {
                commit('SET_CLIENTS', response.data)})
        },

        //AUTH SYSTEM
        connect({ commit }, connectInfo) {
            axios
                .post('http://localhost:3000/users/connect', {
                connectInfo: connectInfo
                })
                .then(function (response) {
                    if (typeof(response.data) == 'object') {
                        commit('SET_USER', response.data);
                        commit('CLEAR_ERR');
                    }else {
                        commit('SET_LOGERR', response.data);
                    }
                })
                .catch(function (error) {
                console.log(error);
             });
        },

        logout({ commit }) {
            commit('LOGOUT');
        }
    },
    getters: {
        // CLIENTS
        clients(state){
            return state.clients
        },
        client (state) {
            return (id) => {
                return state.clients.find((clients) => {
                    return clients.id === id
                })
            }
        },
        topClients(state) {
            return state.clients.sort((clientA, clientB) => {
                return clientA.revenues < clientB.revenues
            })
        },

        // CLIENT NEW ORDER
        products(state) {
            return state.products
        },
        cart(state) {
            return state.cart
        },
        count(state) {
            return state.count
        },
        totalCart(state) {
            let total = 0;
            for(var i = 0; i < state.cart.length; i++) {
                total = total + state.cart[i].price * state.cart[i].quantity
            }
            return total
        },

        // CLIENT SAVED ORDER
        savedOrders(state) {
            return state.savedOrders
        },

        // STORE ORDERS
        orders(state) {
            return state.orders
        },
        orderedProducts(state) {
            return state.orderedProducts
        },
        orderDetails(state) {
            return state.orderDetails
        },

        //STORE's CLIENTS
        clients(state) {
            return state.clients
        },

        // NOTIFICATION
        notification(state) {
            return state.notification
        },

        //USER Auth
        user(state) {
            return state.user
        },

        logErr(state) {
            return state.logErr
        }
    },
    plugins: [vuexLocalStorage.plugin],
})
