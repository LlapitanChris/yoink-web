// root level app component with a router
import { LitElement, html } from 'https://cdn.skypack.dev/lit-element';

import '../pages/HomePage.js';
import '../pages/AboutPage.js';
import '../pages/TablePage.js';


export default class FxApp extends LitElement {
	constructor() {
		super();
		this.path = window.location.pathname;
		// route object to map the path to the NAME of the component
		this.routes = {
			'/': 'fx-home-page',
			'/index.html': 'fx-home-page',
			'/about': 'fx-about-page',
			'/tables': 'fx-table-page'
		}
	}

	static get properties() {
		return {
			path: { type: String },
		}

	}


	render() {
		return html`
		<slot></slot>
		`

	}

	// general route function that will be override the click event
	route = (event) => {
		console.log('Route function called');
		event.preventDefault();
		const path = event.target.getAttribute('href');
		window.history.pushState({}, '', path);
		// call the function to update the page
		this.updatePage();

	}

	// function to update the page
	updatePage() {
		const path = window.location.pathname;
		this.path = path;
		// get the component name
		const componentName = this.routes[path];
		// get the component
		const component = customElements.get(componentName);

		if (!component) {
			console.error('Component not found');
			return;
		}

		// create the component
		const element = document.createElement(componentName);
		// replace the children
		this.replaceChildren(element);

	}

	connectedCallback() {
		super.connectedCallback();
		this.updatePage();
		window.addEventListener('popstate', this.updatePage.bind(this));
		window.route = this.route;
		console.log('window route:', window.route, window.onpopstate);
	}

	disconnectedCallback() { 
		super.disconnectedCallback();
		window.removeEventListener('popstate', this.updatePage.bind(this));
		window.route = null;
	}

}

customElements.define('fx-app', FxApp);