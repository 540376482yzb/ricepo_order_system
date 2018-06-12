import React from 'react'
import './Item.css'
export default function OptionList({itemName, price, quantity, onItemDelete}) {
	const handleItemDelete = e => {
		e.stopPropagation()
		onItemDelete()
	}
	return (
		<div className="item-container">
			<section className="item-name">{itemName}</section>
			<section className="item-price-container">
				<div className="item-price"> + {Number(price / 100).toFixed(2)}</div>
				{quantity != 0 && (
					<div className="item-quantity" onClick={handleItemDelete}>
						{quantity}
					</div>
				)}
			</section>
		</div>
	)
}
