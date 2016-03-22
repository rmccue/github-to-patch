import React from 'react';

const excerptLength = 100;

let excerpt = text => {
	if ( text.length < excerptLength ) {
		return text;
	}

	return text.substring(0, excerptLength).trim() + '…';
};

export default props =>
	<div className="step">
		<header>
			<p>Hi there, and thanks for submitting a pull request for
				WordPress! WordPress development is based on Trac, and is
				built around patches. Luckily, I'm here to make submitting
				your pull request as a patch easy!</p>
		</header>

		<h2><span className="step">Step 1:</span> Select your Pull Request</h2>
		<ul className="pr-list">
			{ props.items.map(item =>
				<li key={ item.id } onClick={ e => props.onSelect( item ) }>
					<span className="title">{ excerpt( item.title ) }</span>
					<span className="number">#{ item.number }</span>
				</li>
			)}
		</ul>

		<p className="actions">
			{ props.isLoading ?
				<span>Loading&hellip;</span>
			:
				<button type="button" onClick={e => props.onReload()}>Reload</button>
			}
		</p>
	</div>;
