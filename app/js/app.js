import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { browserHistory, Router, Route, IndexRoute } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import reducer from './reducers'
import App from './components/App'
import Catalogue from './components/Catalogue'
import Checkout from './components/Checkout'
import Success from './components/Success'
import Failure from './components/Failure'
import PageNotFound from './components/PageNotFound'

const middleware = process.env.NODE_ENV === 'production' ?
  [ thunk ] :
  [ thunk, logger() ]

const store = createStore(
  combineReducers({
    reducer,
    routing: routerReducer
  }),
  applyMiddleware(...middleware)
)

const history = syncHistoryWithStore(browserHistory, store)

render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={Catalogue} />
        <Route path="checkout" component={Checkout} />
        <Route path="success" component={Success} />
        <Route path="failure" component={Failure} />
        <Route path="*" component={PageNotFound} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
)

        // <Route path="checkout" component={Checkout} />
        // <Route path="success" component={Success} />
        // <Route path="failure" component={Failure} />
