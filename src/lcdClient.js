
import axios from 'axios'


class Client {
  constructor(server = "http://sandbox.icheck.com.vn:4396", icheckAPI) {
    this.icheckAPI = icheckAPI
    this.api = axios.create({
      baseURL: server,
      timeout: 10000
    })
  }
  
  /**
   * setBaseUrl 
   * 
   * @param {string} url 
   */
  setBaseURL(url) {
    this.api.setBaseURL(url)
  }


  getAsset(assetId) {
    return this.api.get(`/assets/${assetId}`)
    .then(res => res.data)
  }


  /**
   * trace
   * 
   * @param {String} traceId
   * @return {Promise<Object>}
   */
  trace(traceId) {
    return this.getAsset(traceId)
    .then(asset => {
      return this.api.get(`/txs?tag=asset_id='${traceId}'`)
      .then(res => res.data)
      .then(txs => {
        asset.txs = txs;
        return asset;
      });
    })
    .then(asset => {
      const materials = asset.materials || [];
      return Promise.all(materials.map((material) => {
        return this.getAsset(material.asset_id).then(materialData => {
          return {
            id: materialData.id,
            name: materialData.name,
            quantity: material.quantity,
          };
        });
      })).then(materials => {
        asset.materials = materials;
        return asset;
      });
    })
    .then(buildAsset);
  }
}


const buildAsset = (asset) => {
  return {
    id: asset.id, 
    name: asset.name,
    quantity: asset.quantity,
    properties: asset.properties || [],
    materials: asset.materials || [],
    owner: asset.owner,
    txs: asset.txs.sort(function(a, b) {
      return b.time - a.time;
    }),
  }
}


export default Client