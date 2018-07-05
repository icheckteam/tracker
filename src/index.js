
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import Root from './Root';

const middleware = [ thunk ];
if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger());
}
const store = createStore(
  applyMiddleware(...middleware)
)
ReactDOM.render(<Root store={store} />, document.getElementById('root'));
registerServiceWorker(); 