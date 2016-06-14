import { browserHistory } from 'react-router'
import { routerReducer, routerMiddleware } from 'react-router-redux'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import { products, discount, promoCode, isFetching } from './reducers'
import { loadState, saveState } from './localStorage'
import throttle from 'lodash/throttle'

const configureStore = () => {

  const middleware = [
    thunk,
    routerMiddleware(browserHistory)
  ];

  if (process.env.NODE_ENV === 'production') {
    middleware.push(logger())
  }

  const reducer = combineReducers({
    products,
    discount,
    promoCode,
    isFetching,
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
