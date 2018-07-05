import React, { Component } from 'react';
import { connect } from 'react-redux';
import TrackItem from './TrackItem';
import node from '../node';
import AssetNotFound from '../components/AssetNotFound';
function mapStateToProps(state) {
  return {

  };
}

class TrackContainer extends Component {
  state = {
    asset: {}
  }
  componentDidMount() {
    this.loadAsset(this.props.match.params.id)
  }

  loadAsset(assetId) {
    node.lcd.trace(assetId).then(asset => {
      this.setState({asset: asset});
    })
  }

  render() {
    const { asset } = this.state;

    // change asset 
    if (asset.id && (asset.id != this.props.match.params.id)) {
      this.loadAsset(this.props.match.params.id);
    }

    return (
      <div>
        {asset.id ? (<div><TrackItem asset={asset}/></div>) : <AssetNotFound/> }
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
)(TrackContainer);