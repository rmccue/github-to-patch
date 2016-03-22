import React from 'react';

export default class Preview extends React.Component {
	render() {
		let { trac, patch } = this.props;

		let url = `${trac.base}/ticket/${trac.ticket}`;

		return <div className="step">
			<h2><span className="step">Step 3:</span> Preview</h2>
			<p><span>Uploading </span>
				<code>{ trac.ticket }.diff</code>
				<span> from PR{ patch.pr && patch.pr.number } to </span>
				<a href={ url }>#{ trac.ticket }</a>
				<span> as { trac.username }</span></p>

			<pre className="preview">
				{ patch.patch && patch.patch }
			</pre>

			<p className="actions">
				<button type="button" onClick={e => this.props.onGoBack() }>Back</button>
				<button type="button" onClick={e => this.props.onUpload() }>Upload</button>
			</p>
		</div>;
	}
}