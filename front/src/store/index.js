import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router/index'
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
		clients: state.clients,
		cart: state.cart
	}),
})

export const store = new Vuex.Store({
	state: {
        //Objec clientss is here only to sheat data input for a datatable in "invoice board" vue
		clientss: [{
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
		clients: [],
		logErr: [],
		user: [],
		cart: [],
		products: [],
		orders: [],
		orderedProducts: [],
		orderDetails: [],
		savedOrders: [],
		clientOrders: [],
		notification: [],
	},
	mutations: {
		// CLIENT NEW ORDER
		setCartBySelect: (state, value) => {
			let existingProduct = state.cart.find(function(obj) {
				return obj.id === value.id;
			});

			if (existingProduct) {
				value.quantity++;
			} else {
				state.cart.push(value);
			}
		},
		setCart: (state, value) => {
			//First check if product is allready in cart.
            //Todo : get directly the product's id. Cause getting it by index leads to crappy bugs
			let productId = value[value.length - 1].id;

			var existingProduct = state.cart.find(function(obj) {
				return obj.id === productId;
			});
			//If so, iterate quantity
			if (existingProduct) {
				existingProduct.quantity++;
			}
			//If not, set it with quantity = 1
			else {
				value[value.length - 1].quantity = 1
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
		SET_PRODUCTS(state, products) {
			state.products = products
		},


		// CLIENT SAVED ORDERS
		SET_SAVED_ORDERS(state, savedOrders) {
			state.savedOrders = savedOrders
		},
		SET_CLIENTS_ORDERS(state, clientOrders) {
			state.clientOrders = clientOrders
		},

		// STORE ORDERS
		SET_STORE_ORDERS(state, orders) {
			state.orders = orders
		},
		SET_ORDER_DETAILS(state, orderedProducts) {
			state.orderedProducts = orderedProducts
		},
		SET_NOTIF(state, notifInfo) {
			state.notification = notifInfo
		},
		RESET_NOTIF(state) {
			state.notification = null
		},


		//STORE's CLIENTS
		SET_CLIENTS(state, clients) {
			state.clients = clients
		},


		// AUTH SYSTEM
		SET_USER(state, userInfo) {
			state.user = userInfo
		},
		CLEAR_ERR(state) {
			state.logErr = null
		},
		SET_LOGERR(state, logErr) {
			state.logErr = logErr
		},
		LOGOUT(state) {
			state.user = []
		}
	},

	actions: {
		//STORE NEW CLIENT
		submitNewClient({
			commit,
			dispatch
		}, clientInfo) {
			axios
				.post($axios + '/users/new/client', {
					clientInfo: clientInfo
				})
				.then(function(response) {
					commit('SET_NOTIF', response);
					dispatch('loadClients')
				})
				.catch(function(error) {
					console.log(error);
				});
		},


		// CLIENT NEW ORDER
		loadProducts({
			commit
		}, payload) {
			axios
				.get($axios + '/products/' + payload)
				.then(r => r.data)
				.then(products => {
					commit('SET_PRODUCTS', products)
				})
		},

		takeOrder({
			commit
		}, order) {
			axios
				.post($axios + '/orders/new', {
					order: order
				})
				.then(function(response) {
					commit('SET_NOTIF', response);
				})
				.catch(function(error) {
					console.log(error);
				});
		},

		// CLIENT SAVED ORDERS
		loadSavedOrders({
			commit
		}, payload) {
			axios
				.get($axios + '/orders/saved/' + payload)
				.then(r => r.data)
				.then(savedOrders => {
					commit('SET_SAVED_ORDERS', savedOrders)
				})
		},

		// CLIENT ORDERS
		loadClientOrders({
			commit
		}, payload) {
			function getClientOrders({
				commit
			}, payload) {
				axios
					.get( $axios + '/orders/client/' + payload)
					.then((response) => {
						for (let item of response.data) {
							item.name = item.name.split(',')
							item.quantity = item.quantity.split(',')
							item.price = item.price.split(',')
							item.total = 0
							for (var i = 0; i < item.quantity.length; i++) {
								let quantity = item.quantity[i]
								let price = item.price[i]
								item.total += quantity * price
							}
							item.productQuantity = item.name.map((e, i) => e + " x " + item.quantity[i])
						}
						commit('SET_CLIENTS_ORDERS', response.data)
					})
			}
			//Get the data a first time
			getClientOrders({
				commit
			}, payload);

			//Then update orders every 10s
			setInterval(() => {
				getClientOrders({
					commit
				}, payload);
			}, 10000)
		},

		// STORE ORDERS
		loadOrders({
			commit
		}) {
			//First request
			axios.get($axios + '/orders/').then((response) => {
				commit('SET_STORE_ORDERS', response.data)
			})

			//Then update orders every 10s
			setInterval(() => {
				console.log('updating orders');
				axios.get($axios + '/orders/').then((response) => {
					commit('SET_STORE_ORDERS', response.data)
				})
			}, 10000)
		},

		loadOrderedProducts({
			commit
		}, orderId) {
			axios.get($axios + '/orders/' + orderId).then((response) => {
				commit('SET_ORDER_DETAILS', response.data)
			})
		},

		switchStatus({
			commit,
			dispatch
		}, payload) {
			let id = payload.orderId;
			// let newCategory = payload.newCategory
			axios
				.patch($axios + '/orders/changestatus', {
					order: payload
				})
				.then(function(response) {
					commit('SET_NOTIF', response);
					dispatch('loadOrders', {
						root: true
					});
				})
				.catch(function(error) {
					console.log(error);
				});
		},


		// STORE's CLIENT
		loadClients({
			commit
		}) {
			axios.get($axios + '/users/clients/').then((response) => {
				commit('SET_CLIENTS', response.data)
			})
		},

		//AUTH SYSTEM
		connect({
			commit
		}, connectInfo) {
			axios
				.post($axios + '/users/connect', {
					connectInfo: connectInfo
				})
				.then(function(response) {
					if (typeof(response.data) == 'object') {
						commit('SET_USER', response.data);
						commit('CLEAR_ERR');
					} else {
						commit('SET_LOGERR', response.data);
					}
				})
				.catch(function(error) {
					console.log(error);
				});
		},

		logout({
			commit
		}) {
			commit('LOGOUT');
		}
	},
	getters: {
		// CLIENTS
		clients(state) {
			return state.clients
		},

		client(state) {
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
			for (var i = 0; i < state.cart.length; i++) {
				total = total + state.cart[i].price * state.cart[i].quantity
			}
			return total
		},


		// CLIENT SAVED ORDERS
		savedOrders(state) {
			return state.savedOrders
		},

		// CLIENT ORDERS
		clientOrders(state) {
			return state.clientOrders
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
