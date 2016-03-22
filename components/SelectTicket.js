import React from 'react';

export default props =>
	<div className="step">
		<h2><span className="step">Step 2:</span> Select Trac Ticket</h2>
		<p>Add your ticket number here.
			{' '}
			<a href="https://core.trac.wordpress.org/browser">Head to Trac</a>
			{' '}
			to find or create the relevant ticket.</p>

		<label>
			<span>Ticket Number:</span>
			<input type="text" onChange={e => props.onUpdateTicket(e.target.value) } />
		</label>

		<p className="actions">
			<button type="button" onClick={e => props.onGoBack() }>Back</button>
			<button type="button" onClick={e => props.onGoNext() }>Next</button>
		</p>
	</div>;
