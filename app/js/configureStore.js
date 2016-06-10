import { browserHistory } from 'react-router'
import { routerReducer, routerMiddleware } from 'react-router-redux'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import { products, discount, promoCode } from './reducers'
import { loadState, saveState } from './localStorage'
import throttle from 'lodash/throttle'

const configureStore = () => {

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

  store.subscribe(throttle(() => {
    saveState({
      products: store.getState().products
    });
  }, 1000))

  return store;
};

export default configureStore;
