import React from 'react'
import {shallow, mount} from 'enzyme'
import App from '../components/App'
import fetchMock from 'fetch-mock'
import mock from '../mock.json'
import _ from 'lodash'
//introduce delay and return promise
const sleep = ms => {
	return new Promise(resolve => setTimeout(resolve, ms))
}
const DELAY_MS = 2000

const asyncFn = () => {
	return new Promise(resolve => resolve())
}

describe('App', async () => {
	fetchMock.get(`*`, JSON.stringify(mock))
	describe('testing basic business logic', () => {
		it('should render without crashes', () => {
			shallow(<App />)
		})
		it('should populate state after fetch call is made', async () => {
			const wrapper = mount(<App />)
			await sleep(DELAY_MS - 1000)
			const {name, basePrice, options} = wrapper.instance().state
			expect(name).not.toBeNull()
			expect(basePrice).not.toBeNull()
			expect(options).not.toBeNull()
		})
		it('should add item to the chosen array after addItem is called', async () => {
			const wrapper = mount(<App />)
			await sleep(DELAY_MS - 1000)
			wrapper.instance().addItem({
				optionName: 'Add On',
				updateItem: {
					name: 'bubble',
					price: 50,
					available: true,
					quantity: 0
				}
			})
			// wrapper.update()
			const firstOptionChosen = wrapper.instance().state.options[0].chosen
			expect(_.size(firstOptionChosen)).toBe(1)
		})
		it('should remain max when add item after max allowed', async () => {
			const wrapper = mount(<App />)
			await sleep(DELAY_MS - 1000)
			wrapper.instance().addItem({
				optionName: 'Add On',
				updateItem: {
					name: 'bubble',
					price: 50,
					available: true,
					quantity: 1
				}
			})
			wrapper.instance().addItem({
				optionName: 'Add On',
				updateItem: {
					name: 'bubble',
					price: 50,
					available: true,
					quantity: 1
				}
			})
			const firstOptionChosen = wrapper.instance().state.options[0].chosen
			const bubble = _.find(firstOptionChosen, {name: 'bubble'})
			expect(bubble.quantity).toBe(2)
		})
	})

	describe('when the chosen array is full', () => {
		it('max is 1, add A -> Add B  then A.quantity = 0 and B.quantity =1', async () => {
			const wrapper = mount(<App />)
			await sleep(DELAY_MS - 1000)
			const addItem = wrapper.instance().addItem
			// add A
			addItem({
				optionName: 'Tea',
				updateItem: {
					name: 'milk tea',
					price: 0,
					available: true,
					quantity: 1
				}
			})
			//then add B
			addItem({
				optionName: 'Tea',
				updateItem: {
					name: 'green milk tea',
					price: 0,
					available: true,
					quantity: 1
				}
			})

			const firstOptionChosen = wrapper.instance().state.options[2].chosen
			const milkTea = _.find(firstOptionChosen, {name: 'milk tea'})
			const greenMilkTea = _.find(firstOptionChosen, {name: 'green milk tea'})
			expect(milkTea.quantity).toBe(0)
			expect(greenMilkTea.quantity).toBe(1)
		})
		it('max is 2, add A -> Add A -> Add B   then   A.quantity = 1 and B,quantity = 1', async () => {
			const wrapper = mount(<App />)
			await sleep(DELAY_MS - 1000)
			const {addItem} = wrapper.instance()
			addItem({
				optionName: 'Add On',
				updateItem: {
					name: 'bubble',
					price: 50,
					available: true,
					quantity: 1
				}
			})
			addItem({
				optionName: 'Add On',
				updateItem: {
					name: 'pudding',
					price: 50,
					available: true,
					quantity: 1
				}
			})
			const {state} = wrapper.instance()
			const firstOptionChosen = state.options[0].chosen
			const bubble = _.find(firstOptionChosen, {name: 'bubble'})
			const pudding = _.find(firstOptionChosen, {name: 'pudding'})
			expect(bubble.quantity).toBe(1)
			expect(pudding.quantity).toBe(1)
		})
		it('max is 2, add A -> Add B -> Add A   then   A.quantity = 2 and B.quantity = 0', async () => {
			const wrapper = mount(<App />)
			await sleep(DELAY_MS - 1000)
			const {addItem} = wrapper.instance()
			addItem({
				optionName: 'Add On',
				updateItem: {
					name: 'bubble',
					price: 50,
					available: true,
					quantity: 1
				}
			})
			addItem({
				optionName: 'Add On',
				updateItem: {
					name: 'pudding',
					price: 50,
					available: true,
					quantity: 1
				}
			})
			addItem({
				optionName: 'Add On',
				updateItem: {
					name: 'bubble',
					price: 50,
					available: true,
					quantity: 1
				}
			})
			const {state} = wrapper.instance()
			const firstOptionChosen = state.options[0].chosen
			const bubble = _.find(firstOptionChosen, {name: 'bubble'})
			const pudding = _.find(firstOptionChosen, {name: 'pudding'})
			expect(bubble.quantity).toBe(2)
			expect(pudding.quantity).toBe(0)
		})
		it('max is 3,items are 4, add A 3 times -> add B  then A = 2 and B = 1', async () => {
			const wrapper = mount(<App />)
			await sleep(DELAY_MS - 1000)
			const {addItem} = wrapper.instance()

			// add A x 3
			addItem({
				optionName: 'Test',
				updateItem: {
					name: 'A',
					price: 0,
					available: true,
					quantity: 1
				}
			})
			addItem({
				optionName: 'Test',
				updateItem: {
					name: 'A',
					price: 0,
					available: true,
					quantity: 1
				}
			})
			addItem({
				optionName: 'Test',
				updateItem: {
					name: 'A',
					price: 0,
					available: true,
					quantity: 1
				}
			})
			//Add B
			addItem({
				optionName: 'Test',
				updateItem: {
					name: 'B',
					price: 0,
					available: true,
					quantity: 1
				}
			})
			const {state} = wrapper.instance()
			const testOptionChosen = state.options[1].chosen
			const a = _.find(testOptionChosen, {name: 'A'})
			const b = _.find(testOptionChosen, {name: 'B'})
			expect(a.quantity).toBe(2)
			expect(b.quantity).toBe(1)
		})
		it('max is 3,items are 4, add each A,B,C -> add A   then A=2, B = 0 and C = 1', async () => {
			const wrapper = mount(<App />)
			await sleep(DELAY_MS - 1000)
			const {addItem} = wrapper.instance()

			// add A,B.C
			addItem({
				optionName: 'Test',
				updateItem: {
					name: 'A',
					price: 0,
					available: true,
					quantity: 1
				}
			})
			addItem({
				optionName: 'Test',
				updateItem: {
					name: 'B',
					price: 0,
					available: true,
					quantity: 1
				}
			})
			addItem({
				optionName: 'Test',
				updateItem: {
					name: 'C',
					price: 0,
					available: true,
					quantity: 1
				}
			})
			//Add A
			addItem({
				optionName: 'Test',
				updateItem: {
					name: 'A',
					price: 0,
					available: true,
					quantity: 1
				}
			})

			const testOptionChosen = wrapper.instance().state.options[1].chosen
			const a = _.find(testOptionChosen, {name: 'A'})
			const b = _.find(testOptionChosen, {name: 'B'})
			const c = _.find(testOptionChosen, {name: 'C'})
			expect(a.quantity).toBe(2)
			expect(b.quantity).toBe(0)
			expect(c.quantity).toBe(1)
		})
		it('max is 3,items are 4, add each A,B,C -> add D   then A=0, B = 1,C = 1 and D = 1', async () => {
			const wrapper = mount(<App />)
			await sleep(DELAY_MS - 1000)
			const addItem = wrapper.instance().addItem

			// add A,B<C
			addItem({
				optionName: 'Test',
				updateItem: {
					name: 'A',
					price: 0,
					available: true,
					quantity: 1
				}
			})
			addItem({
				optionName: 'Test',
				updateItem: {
					name: 'B',
					price: 0,
					available: true,
					quantity: 1
				}
			})
			addItem({
				optionName: 'Test',
				updateItem: {
					name: 'C',
					price: 0,
					available: true,
					quantity: 1
				}
			})
			//ADD D
			addItem({
				optionName: 'Test',
				updateItem: {
					name: 'D',
					price: 0,
					available: true,
					quantity: 1
				}
			})

			const testOptionChosen = wrapper.instance().state.options[1].chosen
			const a = _.find(testOptionChosen, {name: 'A'})
			const b = _.find(testOptionChosen, {name: 'B'})
			const c = _.find(testOptionChosen, {name: 'C'})
			const d = _.find(testOptionChosen, {name: 'D'})
			expect(a.quantity).toBe(0)
			expect(b.quantity).toBe(1)
			expect(c.quantity).toBe(1)
			expect(d.quantity).toBe(1)
		})
		it('max is 3,items are 4, add each A,B,C -> remove A -> Add B  then A=0, B = 2,C = 1', async () => {
			const wrapper = mount(<App />)
			await sleep(DELAY_MS - 1000)
			const {addItem, handleDeleteItem: deleteItem} = wrapper.instance()

			// add A
			addItem({
				optionName: 'Test',
				updateItem: {
					name: 'A',
					price: 0,
					available: true,
					quantity: 1
				}
			})
			addItem({
				optionName: 'Test',
				updateItem: {
					name: 'B',
					price: 0,
					available: true,
					quantity: 1
				}
			})
			addItem({
				optionName: 'Test',
				updateItem: {
					name: 'C',
					price: 0,
					available: true,
					quantity: 1
				}
			})
			deleteItem('Test', 'A')
			addItem({
				optionName: 'Test',
				updateItem: {
					name: 'B',
					price: 0,
					available: true,
					quantity: 1
				}
			})

			const testOptionChosen = wrapper.instance().state.options[1].chosen
			const a = _.find(testOptionChosen, {name: 'A'})
			const b = _.find(testOptionChosen, {name: 'B'})
			const c = _.find(testOptionChosen, {name: 'C'})
			expect(a.quantity).toBe(0)
			expect(b.quantity).toBe(2)
			expect(c.quantity).toBe(1)
		})
		it('max is 3,items are 4, add each A,B,C -> remove B -> Add A -> Add B   then A=2, B = 1,C = 0', async () => {
			const wrapper = mount(<App />)
			await sleep(DELAY_MS - 1000)
			const {addItem, handleDeleteItem: deleteItem} = wrapper.instance()

			// add A
			addItem({
				optionName: 'Test',
				updateItem: {
					name: 'A',
					price: 0,
					available: true,
					quantity: 1
				}
			})
			addItem({
				optionName: 'Test',
				updateItem: {
					name: 'B',
					price: 0,
					available: true,
					quantity: 1
				}
			})
			addItem({
				optionName: 'Test',
				updateItem: {
					name: 'C',
					price: 0,
					available: true,
					quantity: 1
				}
			})
			deleteItem('Test', 'B')
			addItem({
				optionName: 'Test',
				updateItem: {
					name: 'A',
					price: 0,
					available: true,
					quantity: 1
				}
			})
			addItem({
				optionName: 'Test',
				updateItem: {
					name: 'B',
					price: 0,
					available: true,
					quantity: 1
				}
			})
			const testOptionChosen = wrapper.instance().state.options[1].chosen
			const a = _.find(testOptionChosen, {name: 'A'})
			const b = _.find(testOptionChosen, {name: 'B'})
			const c = _.find(testOptionChosen, {name: 'C'})
			expect(a.quantity).toBe(2)
			expect(b.quantity).toBe(1)
			expect(c.quantity).toBe(0)
		})
	})
})
