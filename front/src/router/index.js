import Vue from 'vue'
import Router from 'vue-router'

import {Bar} from 'vue-chartjs'

// CLIENTS ROUTES
import Order from '@/components/order/clientOrder'
import SavedOrder from '@/components/order/clientOrder'
import Profile from '@/components/profile/profile'
import ProfileSettings from '@/components/profile/profileSettings'
import CurrentInvoice from '@/components/invoice/currentInvoice'

// PROVIDER ROUTES
import StoreOrders from '@/components/order/storeOrders'
import SalesBoard from '@/components/dashboards/salesBoard'
import ClientsBoard from '@/components/dashboards/clientsBoard'
import InvoicesBoard from '@/components/dashboards/invoicesBoard'
import SalesGraph from '@/components/dashboards/salesGraph'

// TEST
import Test from '@/components/test/test'
import Charts from '@/components/examples/charts'



Vue.use(Router)

export default new Router({
    routes: [
        // CLIENTS ROUTES
        {
        path: '/',
        name: 'newOrder',
        component: Order
        },
        {
        path: '/new/order',
        name: 'newOrder',
        component: Order
        },
        {
        path: '/new/savedorder',
        name: 'newSavedOrder',
        component: SavedOrder
        },
        {
        path: '/profile',
        name: 'profile',
        component: Profile
        },
        {
        path: '/profile/settings',
        name: 'profileSettings',
        component: ProfileSettings
        },
        {
        path: '/invoice/current',
        name: 'currentInvoice',
        component: CurrentInvoice
        },

        // PRODIVER routes
        {
        path: '/store/orders',
        name: 'StoreOrders',
        component: StoreOrders
        },
        {
        path: '/dashboard/salesboard',
        name: 'salesBoard',
        component: SalesBoard, Bar
        },
        {
        path: '/dashboard/clientsboard',
        name: 'clientsBoard',
        component: ClientsBoard
        },
        {
        path: '/dashboard/invoicesboard',
        name: 'invoicesBoard',
        component: InvoicesBoard
        },
        {
        path: '/client/profile/:id',
        name: 'profileClient',
        props: true,
        component: Profile,
        },
        {
        path: '/charts',
        name: 'charts',
        component: Charts,
        },
        {
        path: '/test',
        name: 'test',
        component: Test
        }
  ],
      mode: 'history'
})
