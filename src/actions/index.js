import mockData from '../mock.json'
import {normalizeResponseErrors} from './utils'

const proxyServer = 'https://zhou-cors-proxy.herokuapp.com'
const targetEndPoint = 'https://ricepo-interview-endpoint-td9mf5s8v12x.runkit.sh/:rest_id/menu'
export const fetchTestOrder = () => {
	return fetch(`${proxyServer}/${targetEndPoint}`)
		.then(normalizeResponseErrors)
		.then(res => res.json())
		.then(menu => Promise.resolve(menu))
		.catch(err => Promise.reject(err))
}
