import {fetchTestOrder, calculateSurCharge, isChosenFull} from '../actions/index'

test.only('Fetch test order should return a json on successful call', () => {
	fetchTestOrder().then(menu => {
		console.log(menu)
	})
})
