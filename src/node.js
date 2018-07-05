import IcheckClient from './icheckClient'
import LcdClient from './lcdClient'

const icheckClient = new IcheckClient()
const lcdClient = new LcdClient("http://sandbox.icheck.com.vn:4396", icheckClient)

export default {
  icheck: icheckClient,
  lcd: lcdClient,
}