import { combineReducers } from 'redux';
import * as actions from './actions';
import initialState from './initial-state';

function pullRequests(state = {}, action) {
	switch (action.type) {
		case actions.REQUEST_PRS:
			return Object.assign({}, state, { isLoading: true });

		case actions.RECEIVE_PRS:
			return { isLoading: false, items: action.items };

		default:
			return state;
	}
}

function trac(state = {}, action) {
	switch (action.type) {
		case actions.SET_TICKET_NUMBER:
			return Object.assign({}, state, { ticket: action.number });

		case actions.SET_TRAC_USERNAME:
			return Object.assign({}, state, { username: action.username });

		case actions.SET_TRAC_PASSWORD:
			return Object.assign({}, state, { password: action.password });

		case actions.SET_TRAC_STATE:
			return Object.assign({}, state, { state: action.state });

		default:
			return state;
	}
}

function patch(state = {}, action) {
	switch (action.type) {
		case actions.SET_PULL_REQUEST:
			return Object.assign({}, state, { pr: action.pr });

		case actions.SET_PATCH:
			return Object.assign({}, state, { patch: action.patch });

		default:
			return state;
	}
}

function step(state = {}, action) {
	switch ( action.type ) {
		case actions.CHANGE_STEP_RELATIVE:
			return state + action.delta;

		default:
			return state;
	}
}

function uploader(state = {}, action) {
	switch ( action.type ) {
		case actions.SET_UPLOAD_STATE:
			return Object.assign({}, state, { state: action.state });

		case actions.SET_UPLOAD_RESPONSE:
			return Object.assign({}, state, { data: action.data });

		default:
			return state;
	}
}

let reducer = combineReducers({
	pullRequests,
	trac,
	patch,
	step,
	uploader
});

export default (state, action) => {
	if ( action.type === actions.RESET ) {
		state = initialState;
	}

	return reducer(state, action);
};
