import mockData from '../mock.json'
import {normalizeResponseErrors} from './utils'
import _ from 'lodash'
const proxyServer = 'https://zhou-cors-proxy.herokuapp.com'
const targetEndPoint = 'https://ricepo-interview-endpoint-td9mf5s8v12x.runkit.sh/:rest_id/menu'
export const fetchTestOrder = () => {
	return fetch(`${proxyServer}/${targetEndPoint}`)
		.then(normalizeResponseErrors)
		.then(res => res.json())
		.then(menu => Promise.resolve(menu))
		.catch(err => Promise.reject(err))
}

export const calculateSurCharge = options => {
	return options.reduce((acc, currOption) => {
		const {chosen} = currOption
		const optionTotal = _.sumBy(chosen, item => Number(item.price) * Number(item.quantity)) || 0
		return (acc += optionTotal)
	}, 0)
}

export const findOption = (options, optionName) => {
	return _.find(options, {name: optionName})
}

export const isChosenFull = (chosenOption, max) => {
	if (max === 0) return false
	const total = _.sumBy(chosenOption, item => Number(item.quantity))
	if (total >= max) {
		return true
	}
	return false
}
