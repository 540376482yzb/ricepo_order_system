import React from 'react'
import './Header.css'
export default function Header(props) {
	return (
		<header className="order-header" onClick={() => props.onClick()}>
			<h3>{props.title}</h3>
			<section className="order-header-text">{props.price / 100}</section>
		</header>
	)
}
