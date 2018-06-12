import mockData from '../mock.json'
import {normalizeResponseErrors} from './utils'
export const fetchTestOrder = () => {
	return fetch(
		`https://cors-anywhere.herokuapp.com/https://ricepo-interview-endpoint-td9mf5s8v12x.runkit.sh/:rest_id/menu`
	)
		.then(normalizeResponseErrors)
		.then(res => res.json())
		.then(menu => Promise.resolve(menu))
		.catch(err => Promise.reject(err))
}
