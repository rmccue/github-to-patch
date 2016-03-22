import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { Provider } from 'react-redux';

import App from './components/App';

import { updatePRs } from './actions';
import reducers from './reducers';
import initialState from './initial-state';

let enhancer;
let DevTools;

if (__DEBUG__) {
	DevTools = require('./components/DevTools').default;
	enhancer = compose(
		applyMiddleware( thunkMiddleware ),
		DevTools.instrument()
	);
} else {
	enhancer = applyMiddleware( thunkMiddleware );
}

let store = createStore(reducers, initialState, enhancer);

// Immediately dispatch an update to load pull requests
store.dispatch(updatePRs());

ReactDOM.render(
	<Provider store={ store }>
		<App />
	</Provider>,
	document.getElementById('app')
);

if ( __DEBUG__ ) {
	let container = document.createElement('div');
	document.body.appendChild(container);

	ReactDOM.render(
		<Provider store={ store }>
			<DevTools />
		</Provider>,
		container
	);
}
