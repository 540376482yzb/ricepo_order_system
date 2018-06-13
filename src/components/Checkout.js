import React from 'react'
import './Checkout.css'
import {calculateSurCharge} from '../actions/index'
export default function Checkout(props) {
	const {name, basePrice, options, checkout} = props
	const renderOptions = options => {
		return options.map(option => {
			return (
				<div>
					<header className="checkout-option-header">{option.name}</header>
					<ul className="checkout-option-list-container">{renderItems(option.chosen)}</ul>
				</div>
			)
		})
	}
	const renderItems = items => {
		//only render items whose quantity is greater than 0
		return items.map((item, index) => {
			if (item.quantity > 0) {
				return (
					<li key={index}>
						{item.quantity} x {item.name} ------------------------- ${(item.price * item.quantity) /
							100}
					</li>
				)
			}
		})
	}

	const total = (basePrice + calculateSurCharge(options)) / 100
	return (
		<main className="checkout">
			<section className="checkout-message">
				<header>
					<h3>Checkout</h3>
				</header>
				<hr />
				<div className="checkout-base">
					1 x {name} ------------------------- $ {basePrice / 100}
				</div>
				{renderOptions(options)}
				<hr />
				<section className="checkout-total">Total ----------------- $ {total}</section>
			</section>
			{/* mock checkout out, do not have functionality as now */}
			<button className="checkout-button" onClick={() => checkout()}>
				Proceed to checkout
			</button>
		</main>
	)
}
