
import axios from 'axios'


class Client {
  constructor(server = "https://core.icheck.com.vn") {
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

  /**
   * getProductByBarcode
   * @param {String} barcode 
   * 
   * @return  {Promise<Object>}
   */
  getProductByBarcode(barcode) {
    return this.axios.get(`/scan/${barcode}`).then(product => {
      return {
        barcode: product.gtin_code,
        name: product.product_name,
        image: product.image_default,
        attachments: product.attachments,
      }
    });
  }

}


export default Client