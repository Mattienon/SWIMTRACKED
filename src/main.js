import './assets/main.css'

import { createApp } from 'vue'
// Vuetify
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import DayJsAdapter from '@date-io/dayjs' // Import the DayJsAdapter

import App from './App.vue'
import router from './router'

// Create the Vuetify instance
const vuetify = createVuetify({
  components,
  directives,
  date: {
    adapter: DayJsAdapter, // Use DayJsAdapter for date handling
  },
  icons: {
    defaultSet: 'mdi', // Specify Material Design Icons
  },
})

// Create the Vue app
const app = createApp(App)

// Use Vuetify and Router
app.use(vuetify)
app.use(router)

// Mount the app
app.mount('#app')