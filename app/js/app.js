import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { browserHistory, Router, Route, IndexRoute } from 'react-router'
import { syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import { getAllProducts } from './actions'
import { routes } from './constants'
import { products, discount, promoCode } from './reducers'
import App from './components/App'
import Catalogue from './components/Catalogue'
import Checkout from './components/Checkout'
import Success from './components/Success'
import Failure from './components/Failure'
import PageNotFound from './components/PageNotFound'
import { loadState, saveState } from './localStorage'

const middleware = process.env.NODE_ENV === 'production' ?
  [ thunk, routerMiddleware(browserHistory) ] :
  [ thunk, routerMiddleware(browserHistory), logger() ]

const reducer = combineReducers({
  products,
  discount,
  promoCode,
  routing: routerReducer
});

const persistedState = loadState();

const store = createStore(
  reducer,
  persistedState,
  applyMiddleware(...middleware)
)

store.subscribe(() => {
  saveState({
    products: store.getState().products
  });
})

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
