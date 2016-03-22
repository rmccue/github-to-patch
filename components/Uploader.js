import React from 'react';

export default class Uploader extends React.Component {
	render() {
		let { state, trac, data } = this.props;

		var status;
		var isDone = true;
		switch ( state ) {
			case 'uploading':
				status = <p>Currently uploading&hellip;</p>;
				break;

			case 'done':
				let ticket = trac.ticket;
				let filename = data.filename;
				let url = `${trac.base}/attachment/ticket/${ticket}/${filename}`;
				let ticket_url = `${trac.base}/ticket/${ticket}`;

				status = <div>
					<p>
						<span>Uploaded to { trac.ticket } as </span>
						<a href={url}>{ data.filename }</a>.
					</p>
					<p>
						<span>After adding a ticket, you should </span>
						<a href={ticket_url}>leave a comment</a>
						<span> explaining the ticket and what you've changed, as
							Trac does not notify people when you upload a patch.</span>
					</p>
					<p>
						Thanks, and have a wonderful day. :)
					</p>
				</div>;
				isDone = false;
				break;

			case 'error':
				status = <div>
					<p>Whoops, I was unable to upload the patch for you. Here's what the server said:</p>
					<p>{ data.message }</p>
				</div>;
		}
		return <div className="step">
			<h2><span className="step">Step 5:</span> Upload Status</h2>
			{ status }

			{ isDone ?
				<p className="actions">
					<button type="button" onClick={e => this.props.onGoBack() }>Back</button>
				</p>
			:
				<p className="actions">
					<button type="button" onClick={e => this.props.onReset() }>Reset and Start Again</button>
				</p>
			}
		</div>;
	}
}
