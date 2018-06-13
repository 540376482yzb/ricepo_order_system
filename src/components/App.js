import React, {Component} from 'react'
import './App.css'
import {fetchTestOrder, findOption, isChosenFull} from '../actions/index'
import Header from './Header'
import Option from './Option'
import _ from 'lodash'
import Overlay from './Overlay'
import Warning from './Warning'
import Checkout from './Checkout'
class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			name: null,
			basePrice: null,
			options: null,
			history: {},
			warningMessage: null,
			openCheckout: false
		}
	}
	componentDidMount() {
		fetchTestOrder()
			.then(({name, price: basePrice, options}) => this.setState({name, basePrice, options}))
			.catch(err => console.log(err))
	}

	handleAddItem = data => {
		this.addItem(data)
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
		const targetOption = findOption(_options, data.optionName)
		const {max, chosen} = targetOption
		const targetItemInChosen = _.find(chosen, {name: data.updateItem.name})
		//conditionally remove item quantity
		if (isChosenFull(chosen, max)) {
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
		//add target item quantity
		targetItemInChosen
			? targetItemInChosen.quantity < max && (targetItemInChosen.quantity += 1)
			: chosen.push(data.updateItem)

		this.saveItemAfterAdd(_options, targetOption, data)
	}

	saveItemAfterAdd(options, targetOption, data) {
		this.setState(prevState => {
			const prevItems =
				prevState.history[targetOption.name] !== undefined
					? _.cloneDeep(prevState.history[targetOption.name])
					: []
			_.size(prevItems) >= targetOption.max && prevItems.shift()
			prevItems.push(data.updateItem.name)
			return {
				options,
				history: {...prevState.history, [targetOption.name]: prevItems}
			}
		})
	}

	handleDeleteItem = (optionName, itemName) => {
		const _options = _.cloneDeep(this.state.options)
		const targetOption = findOption(_options, optionName)
		let targetItem = _.find(targetOption.chosen, {name: itemName})
		targetItem.quantity > 0 && (targetItem.quantity -= 1)
		this.setState({
			options: _options
		})
	}

	handleCheckout = () => {
		const {options} = this.state
		const minRequired = _.filter(options, option => {
			const {chosen, min} = option
			const totalQuantity = _.sumBy(chosen, item => Number(item.quantity)) || 0
			return min !== 0 && totalQuantity < min ? true : false
		})
		const warningMessages = _.map(
			minRequired,
			entry => `pick at least ${entry.min} item from ${entry.name}`
		)
		if (_.size(warningMessages) > 0) this.setState({warningMessages})
		else this.setState({openCheckout: true})
	}

	render() {
		const {name, basePrice, options, warningMessages, openCheckout} = this.state
		if (!name || !basePrice || !options) return <div>Loading ...</div>
		return (
			<div className="App">
				<Header
					title={name}
					basePrice={basePrice}
					options={options}
					onClick={this.handleCheckout}
				/>
				<main>
					{options.map((option, index) => (
						<Option
							key={index}
							option={option}
							handleAddItem={this.handleAddItem}
							handleDeleteItem={this.handleDeleteItem}
						/>
					))}
				</main>
				{warningMessages && (
					<Overlay>
						<Warning
							messages={warningMessages}
							onConfirm={() => this.setState({warningMessages: null})}
						/>
					</Overlay>
				)}
				{openCheckout && (
					<Overlay>
						<Checkout
							basePrice={basePrice}
							name={name}
							options={options}
							checkout={() => this.setState({openCheckout: false})}
						/>
					</Overlay>
				)}
			</div>
		)
	}
}

export default App
