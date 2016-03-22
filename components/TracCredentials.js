import React from 'react';

export default props =>
	<div className="step">
		<h2><span className="step">Step 3:</span> Enter Username/Password</h2>
		<p>To upload the ticket to Trac, we'll need your WordPress.org
			username and password. This is passed to the server so I can
			create the patch for you, but is never saved or sent to any server
			except WordPress.org.</p>

		<label>
			<span>Username:</span>
			<input type="text" onChange={e => props.onUpdateUsername(e.target.value) } />
		</label>

		<label>
			<span>Password:</span>
			<input type="password" onChange={e => props.onUpdatePassword(e.target.value) } />
		</label>

		<p className="actions">
			<button type="button" onClick={e => props.onGoBack() }>Back</button>
			<button type="button" onClick={e => props.onGoNext() }>Next</button>
		</p>
	</div>;
