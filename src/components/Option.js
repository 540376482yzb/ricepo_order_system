import React from 'react'
import _ from 'lodash'
import Item from './Item'
import './Option.css'
import Star from 'react-icons/lib/fa/star'
export default class Option extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			focusItem: null
		}
	}

	//save current hover item into state
	handleSelect = name => {
		this.setState({focusItem: name})
	}

	handleAddItem = item => {
		const {name, price, available} = item
		this.props.handleAddItem({
			optionName: this.props.option.name,
			updateItem: {name, price, quantity: 1, available}
		})
	}

	renderItems = items => {
		const {focusItem} = this.state
		const {chosen} = this.props.option
		return _.map(items, item => {
			const {name, price, available} = item
			const itemInChosen = _.find(chosen, {name})
			return (
				available && (
					<li
						key={name}
						className="option-list"
						onMouseEnter={() => this.handleSelect(name)}
						onMouseLeave={() => this.handleSelect(null)}
						onClick={() => this.handleAddItem(item)}
					>
						{/* Display star icon on hover */}
						{focusItem === name && <Star className="option-star" />}
						<Item name={name} price={price} quantity={!!itemInChosen && itemInChosen.quantity} />
					</li>
				)
			)
		})
	}
	render() {
		const {option} = this.props
		return (
			<main>
				<header className="option-header">{option.name}</header>
				<ul className="option-list-container">{this.renderItems(option.items)}</ul>
			</main>
		)
	}
}
