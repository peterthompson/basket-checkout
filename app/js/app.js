import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { getAllProducts } from './actions'
import configureStore from './configureStore'
import Root from './components/Root'

const store = configureStore();

const history = syncHistoryWithStore(browserHistory, store)

store.dispatch(getAllProducts())

render(
  <Root store={store} history={history} />,
  document.getElementById('root')
)
