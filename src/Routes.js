import React from 'react'
import { Route } from "react-router-dom";
import TrackContainer from './containers/TrackContainer';
export const Routes = () => {
  return(
    <div>
      <Route path="/track/:id" component={TrackContainer} />
    </div>
  )
}

export default Routes