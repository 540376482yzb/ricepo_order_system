import React from 'react'
import './Checkout.css'
export default function Warning(props) {
	return (
		<main className="checkout">
			<section className="checkout-message">
				<header>
					<h3>Checkout</h3>
				</header>
				{/* {messages.map((message, index) => <p key={index}>{message}</p>)} */}
			</section>
			<button className="checkout-button">Proceed to checkout</button>
		</main>
	)
}
