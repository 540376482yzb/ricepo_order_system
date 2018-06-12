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
      Logic Analysis:
      if chosen is full
        if chosen has size greater than 1 && user' order pattern follows A -> B -> A
            then find the earliest non-target item and reduce it's quantity by 1
        for all other cases reduce the earliest item's quantity (including target item) by 1
      add one to the target item
        */
	addItem = data => {
		const {options, history} = this.state
		const _options = _.cloneDeep(options)
		const targetOption = this.findItem(_options, data)
		const {max, chosen} = targetOption
		const targetItemInChosen = _.find(chosen, {name: data.updateItem.name})
		if (this.isChosenFull(chosen, max)) {
			const prevItemName = history[targetOption.name][0]
			const prevItem = _.find(chosen, {name: prevItemName})
			const theOtherItem =
				targetItemInChosen !== undefined
					? _.find(chosen, item => item.name !== targetItemInChosen.name)
					: undefined
			max > 1 && theOtherItem && prevItemName === targetItemInChosen.name
				? theOtherItem.quantity >= 1 && (theOtherItem.quantity -= 1)
				: prevItem.quantity >= 1 && (prevItem.quantity -= 1)
		}
		targetItemInChosen
			? targetItemInChosen.quantity < max && (targetItemInChosen.quantity += 1)
			: chosen.push(data.updateItem)

		this.saveItem(_options, targetOption, data)
	}

	saveItem(options, targetOption, data) {
		this.setState(prevState => {
			const prevItems = prevState.history[targetOption.name] || []
			_.size(prevItems) >= targetOption.max && prevItems.shift()
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
		console.log('total', total)
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
