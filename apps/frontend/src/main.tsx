import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import Router from 'src/components/Router'
import store from './store'

import 'src/styles/fonts.css'
import 'simplebar-react/dist/simplebar.min.css'
import { Provider } from 'react-redux'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router />
    </Provider>
  </React.StrictMode>
)
