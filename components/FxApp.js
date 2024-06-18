// root level app component with a router
import { LitElement, html } from 'https://cdn.skypack.dev/lit-element';

import '../pages/HomePage.js';
import '../pages/AboutPage.js';
import '../pages/ScriptStepPage.js';
import '../pages/ReferencePage.js';
import '../pages/DetailPage.js';
import '../pages/CallChainPage.js';
import '../pages/TablePage.js';



export default class FxApp extends LitElement {
	constructor() {
		super();
		this.path = window.location.pathname;
		// route object to map the path to the NAME of the component
		// the DEFAULT component is the table-page
		this.routes = {
			'/': 'fx-home-page',
			'/index.html': 'fx-home-page',
			'/about': 'fx-about-page',
			'/script-step': 'fx-script-step-page',
			'/reference': 'fx-reference-page',
			'/detail': 'detail-page',
			'/call-chain': 'call-chain-page',
		}
	}

	static get properties() {
		return {
			path: { type: String },
			xmlDocument: { type: Object },
			pathToXml: { type: String, reflect: true, attribute: 'path-to-xml' },
			routes: { type: Object },
			href: { type: String },
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
		if (!this.xmlDocument) { 
			return html`
			<form>
				<label for="file-upload">Upload an XML file:</label>
				<input type="file" id="file-upload" name="file-upload">
				<button type="button" @click=${this.readFile}>Submit</button>
			</form>
			`
		}
		return html`
		<slot></slot>
		`

	}

	readFile(event) { 
		event.preventDefault();
		const file = this.renderRoot.querySelector('#file-upload').files[0];
		const reader = new FileReader();
		reader.onload = (event) => { 
			const xmlDoc = new DOMParser().parseFromString(event.target.result, 'text/xml');
			this.xmlDocument = xmlDoc;
		}
		reader.readAsText(file);
	
	}

	// general route function that will be override the click event
	route = (event) => {
		console.log('Route function called', event.target.getAttribute('href'), event.target);
		event.preventDefault();
		const path = event.target?.getAttribute('href') || event.currentTarget?.getAttribute('href') || event.target?.href || event.currentTarget?.href;
		window.history.pushState({}, '', path);
		// call the function to update the page
		this.updatePage();

	}

	// function to update the page
	updatePage() {
		const path = window.location.pathname;
		// path w/ query string
		const href = window.location.href;
		// if the path is the same as the current path, return
		if (href === this.href && path !== '/') return;
		this.path = path;
		this.href = href;
		// get the component name
		const componentName = this.routes?.[path] || 'table-page';
		// get the component
		const component = customElements.get(componentName)

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