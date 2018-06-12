import React, {Component} from 'react'
import './App.css'
import {fetchTestOrder} from '../actions/index'
import Header from './Header'
import Option from './Option'
import _ from 'lodash'

class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			name: null,
			price: null,
			options: null,
			history: {}
		}
	}
	componentDidMount() {
		fetchTestOrder()
			.then(({name, price, options}) => this.setState({name, price, options}))
			.catch(err => console.log(err))
	}

	handleAddItem = data => {
		this.addItem(data)
	}
	findItem = (options, data) => {
		return _.find(options, {name: data.optionName})
	}

	/*
            1. chosen is full but has no other items. 
                operation: ignore the action
            2. chosen is full, there are other items whose quantity is 1
              operation: remove previous item then add one quantity to target item
            3. chosen is full, there are other items whose quantity is more than 1
              operation: reduce previous item quantity by 1 then add one quantity to the target item
            4. chosen is not full, add the items
        */
	addItem = data => {
		const {history} = this.state
		const _options = _.cloneDeep(this.state.options)
		//find the targetOption in the deep clone state
		const targetOption = this.findItem(_options, data)
		const {max, chosen} = targetOption
		const prevOption = history[targetOption.name]
		const emptyChosen = _.size(chosen) === 0
		if (emptyChosen) {
			//push item directly for empty chosen array
			chosen.push(data.updateItem)
		} else {
			const foundItem = _.find(chosen, {name: data.updateItem.name})
			if (this.isChosenFull(chosen, max) && _.size(chosen) !== 1) {
			} else {
			}
		}
		this.saveItem(_options, targetOption, data)
	}

	saveItem(options, targetOption, data) {
		this.setState(prevState => {
			const prevOption = prevState.history[targetOption.name]
			let prevItems
			if (!prevOption) {
				prevItems = []
			} else {
				prevItems = [...prevOption.prevItems]
				_.size(prevItems) < targetOption.max && prevItems.shift()
			}
			prevItems.push(data.updateItem.name)
			return {
				options,
				history: {...prevState.history, [targetOption.name]: prevItems}
			}
		})
	}

	isChosenFull = (chosenOption, max) => {
		if (max === 0) return false
		const total = _.sumBy(chosenOption, item => Number(item.quantity))
		if (total >= max) {
			return true
		}
		return false
	}

	render() {
		const {name, price, options} = this.state
		if (!name || !price || !options) return <div>Loading ...</div>

		return (
			<div className="App">
				<Header title={name} price={price} />
				<main>
					{options.map((option, index) => (
						<Option key={index} option={option} handleAddItem={this.handleAddItem} />
					))}
				</main>
			</div>
		)
	}
}

export default App
