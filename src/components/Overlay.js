import React from 'react'
import './Overlay.css'
export default function Overlay(props) {
	return <div className="overlay-container">{props.children}</div>
}
