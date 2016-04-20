// Ensure fetch polyfill is loaded.
require('whatwg-fetch');

export const CHANGE_STEP_RELATIVE = 'CHANGE_STEP_RELATIVE';
export const REQUEST_PRS = 'REQUEST_PRS';
export const RECEIVE_PRS = 'RECEIVE_PRS';
export const SET_PULL_REQUEST = 'SET_PULL_REQUEST';
export const SET_PATCH = 'SET_PATCH';
export const SET_TICKET_NUMBER = 'SET_TICKET_NUMBER';
export const SET_TRAC_USERNAME = 'SET_TRAC_USERNAME';
export const SET_TRAC_PASSWORD = 'SET_TRAC_PASSWORD';
export const UPLOAD_PATCH = 'UPLOAD_PATCH';
export const SET_UPLOAD_STATE = 'SET_UPLOAD_STATE';
export const SET_UPLOAD_RESPONSE = 'SET_UPLOAD_RESPONSE';
export const RESET = 'RESET';

export const goNext = () => ({ type: CHANGE_STEP_RELATIVE, delta: 1 });
export const goBack = () => ({ type: CHANGE_STEP_RELATIVE, delta: -1 });

let requestPRs = () => ({ type: REQUEST_PRS });
let receivePRs = items => ({ type: RECEIVE_PRS, items });

export function updatePRs() {
	return dispatch => {
		dispatch(requestPRs());

		var promise = fetch('https://api.github.com/repos/WordPress/WordPress/pulls?state=all');
		promise.then(response => response.json()).then(items => dispatch(receivePRs(items)));
	};
}

let setPRData = pr => ({ type: SET_PULL_REQUEST, pr });
let setPatch = patch => ({type: SET_PATCH, patch});

export const setPullRequest = pr => {
	return dispatch => {
                
		dispatch(setPRData(pr));

		let opts = {
			headers: {
				Accept: 'application/vnd.github.v3.diff',
			}
		};
		let promise = fetch(`https://api.github.com/repos/WordPress/WordPress/pulls/${pr.number}`, opts);
		promise.then(response => response.text()).then(data => dispatch(setPatch(data)));
	}
};
export const setTicketNumber = number => ({ type: SET_TICKET_NUMBER, number });
export const setTracUsername = username => ({ type: SET_TRAC_USERNAME, username });
export const setTracPassword = password => ({ type: SET_TRAC_PASSWORD, password });

export function uploadPatch() {
	return (dispatch, getStore) => {
		let { trac, patch } = getStore();
		dispatch({ type: SET_UPLOAD_STATE, state: 'uploading' });

		let url = '';
		let options = {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				ticket: trac.ticket,
				pr: patch.pr.number,
				patch: patch.patch,
				username: trac.username,
				password: trac.password,
			}),
		};

		let promise = fetch(url, options);
		promise.then(response => response.json()).then(data => {
			dispatch({
				type: SET_UPLOAD_RESPONSE,
				data,
			});

			if ( data.error ) {
				dispatch({
					type: SET_UPLOAD_STATE,
					state: 'error',
				});
			} else {
				dispatch({
					type: SET_UPLOAD_STATE,
					state: 'done',
				});
			}
		});
	};
}

export const reset = () => dispatch => {
	dispatch({ type: RESET });
	updatePRs()(dispatch);
};

export function parseURL() {
        var parser = document.createElement('a'),
            searchObject = {},
            queries, split, i;
        // Let the browser do the work
        parser.href = window.location;
        // Convert query string to object
        queries = parser.search.replace(/^\?/, '').split('&');
        for( i = 0; i < queries.length; i++ ) {
            split = queries[i].split('=');
            searchObject[split[0]] = split[1];
        }
        return {
            protocol: parser.protocol,
            host: parser.host,
            hostname: parser.hostname,
            port: parser.port,
            pathname: parser.pathname,
            search: parser.search,
            searchObject: searchObject,
            hash: parser.hash
        };
}

export function selectPR() {
    var url = parseURL();
    if(url.searchObject['pr'] != undefined) {
        document.querySelector('#pr-' + url.searchObject['pr']).parentNode.click();
    }
}