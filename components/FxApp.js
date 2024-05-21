// root level app component with a router
import { LitElement, html } from 'https://cdn.skypack.dev/lit-element';

import '../pages/HomePage.js';
import '../pages/AboutPage.js';
import '../pages/BaseTablePage.js';
import '../pages/FieldsPage.js';
import '../pages/CatalogPage.js';


export default class FxApp extends LitElement {
	constructor() {
		super();
		this.path = window.location.pathname;
		// route object to map the path to the NAME of the component
		this.routes = {
			'/': 'fx-home-page',
			'/index.html': 'fx-home-page',
			'/about': 'fx-about-page',
			'/table': 'fx-table-page',
			'/field': 'fx-field-page',
			'/catalog': 'fx-catalog-page'
		}
	}

	static get properties() {
		return {
			path: { type: String },
			xmlDocument: { type: Object },
			pathToXml: { type: String, reflect: true, attribute: 'path-to-xml' },
			routes: { type: Object }
		}

	}

	set pathToXml(value) {
		this._pathToXml = value;
		// fetch the xml
		this.fetchXml();
	}

	get pathToXml() { 
		return this._pathToXml;
	
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
		const componentName = this.routes?.[path] || '';
		// get the component
		const component = componentName ? customElements.get(componentName): null;

		if (!component) {
			console.error(`Component ${componentName} not found for path ${path}`);
		} else {
			// create the component
			const element = document.createElement(componentName);
			// replace the children
			this.replaceChildren(element);
		}


	}

	connectedCallback() {
		super.connectedCallback();
		this.updatePage();
		window.addEventListener('popstate', this.updatePage.bind(this));
		window.route = this.route;

	}

	disconnectedCallback() { 
		super.disconnectedCallback();
		window.removeEventListener('popstate', this.updatePage.bind(this));
		window.route = null;
	}

	async fetchXml() {
		try {
			let xml = await fetch(this._pathToXml).then(response => response.text())
			const parser = new DOMParser()
			const xmlDoc = parser.parseFromString(xml, 'text/xml')
			this.xmlDocument = xmlDoc;
			console.debug('xmlDoc:', xmlDoc)
		} catch (error) {
			console.error('Error occurred in fetchXml:', error)
		}
	}

}

customElements.define('fx-app', FxApp);