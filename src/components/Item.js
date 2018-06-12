import React from 'react'
import './Item.css'
export default function OptionList({name, price, quantity}) {
	return (
		<div className="item-container">
			<section className="item-name">{name}</section>
			<section className="item-price-container">
				<div className="item-price"> + {Number(price / 100).toFixed(2)}</div>
				{quantity !== 0 && <div>{quantity}</div>}
			</section>
		</div>
	)
}
