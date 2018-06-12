import React from 'react'
import './Warning.css'
export default function Warning({messages, onConfirm}) {
	return (
		<main className="warning">
			<section className="warning-message">
				<header>
					<h3>Before you checkout out ...</h3>
				</header>
				{messages.map((message, index) => <p key={index}>{message}</p>)}
			</section>
			<button onClick={() => onConfirm()} className="warning-button">
				got it !
			</button>
		</main>
	)
}
