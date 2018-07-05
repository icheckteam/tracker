// @flow
import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { Routes } from './Routes';
import PropTypes from 'prop-types';
export * from './Root.css'
export const Root = ({store}) => {
  return(
    <Provider store={store}>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </Provider>
  )
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
};

export default Root