import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { browserHistory, Router, Route, IndexRoute } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { getAllProducts } from './actions'
import { routes } from './constants'
import { products, discount, promoCode } from './reducers'
import App from './components/App'
import Catalogue from './components/Catalogue'
import Checkout from './components/Checkout'
import Success from './components/Success'
import Failure from './components/Failure'
import PageNotFound from './components/PageNotFound'
import configureStore from './configureStore'

const store = configureStore();

const history = syncHistoryWithStore(browserHistory, store)

store.dispatch(getAllProducts())

render(
  <Provider store={store}>
    <Router history={history}>
      <Route path={routes.Catalogue} component={App}>
        <IndexRoute component={Catalogue} />
        <Route path={routes.Checkout} component={Checkout} />
        <Route path={routes.Success} component={Success} />
        <Route path={routes.Failure} component={Failure} />
        <Route path={routes.PageNotFound} component={PageNotFound} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
)
