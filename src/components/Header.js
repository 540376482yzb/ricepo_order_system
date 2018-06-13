import React from 'react'
import './Header.css'
import _ from 'lodash'
import {calculateSurCharge} from '../actions/index'
export default function Header(props) {
	const optionsSurCharger = calculateSurCharge(props.options)
	console.log(optionsSurCharger)
	return (
		<header className="order-header" onClick={() => props.onClick()}>
			<h3>{props.title}</h3>
			<section className="order-header-text">{(props.basePrice + optionsSurCharger) / 100}</section>
		</header>
	)
}
