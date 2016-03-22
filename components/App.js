import React from 'react';
import { connect } from 'react-redux';

import * as actions from '../actions';
import SelectPR from './SelectPR';
import SelectTicket from './SelectTicket';
import TracCredentials from './TracCredentials';
import Preview from './Preview';
import Uploader from './Uploader';
import GitHubIcon from './Icons/GitHub';
import WordPressIcon from './Icons/WordPress';

class App extends React.Component {
	render() {
		const { step, pullRequests, dispatch } = this.props;

		return <div className="step-wrapper">
			<header>
				<WordPressIcon />
				<GitHubIcon />
				<h1>Upload GitHub Patch to Trac</h1>
			</header>

			<div className={`steps step-${step}`}>
				<SelectPR { ...pullRequests }
					onReload={ () => dispatch(actions.updatePRs()) }
					onSelect={ pr => {
						dispatch(actions.setPullRequest(pr));
						dispatch(actions.goNext());
					}} />

				<SelectTicket
					onUpdateTicket={ val => dispatch(actions.setTicketNumber(val))}
					onGoBack={ () => dispatch(actions.goBack()) }
					onGoNext={ () => dispatch(actions.goNext()) } />

				<TracCredentials
					onUpdateUsername={val => dispatch(actions.setTracUsername(val)) }
					onUpdatePassword={val => dispatch(actions.setTracPassword(val)) }
					onGoBack={ () => dispatch(actions.goBack()) }
					onGoNext={ () => dispatch(actions.goNext()) } />

				<Preview patch={ this.props.patch } trac={ this.props.trac }
					onGoBack={ () => dispatch(actions.goBack()) }
					onUpload={ () => {
						dispatch(actions.uploadPatch());
						dispatch(actions.goNext());
					}} />

				<Uploader {...this.props.uploader} trac={ this.props.trac }
					onGoBack={ () => dispatch(actions.goBack()) }
					onReset={ () => dispatch(actions.reset()) } />
			</div>
		</div>;
	}
}

export default connect(state => state)(App);
