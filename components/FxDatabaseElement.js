import { LitElement, html, css, render } from 'https://cdn.skypack.dev/lit-element';

import './FxModificationTag.js';

export default class FxDatabaseElement extends LitElement { 

	constructor() {
		super();
		this.id;
		this._uuidXml;
		this._xml;
	}

	static get properties() {
		return {
			id: { type: String, reflect: true },
			uuid: { type: String, reflect: true},
			uuidXml: { type: Object, state: true },
			xml: { type: Object },
		}

	}

	static get styles() { 
		return css`

			:host {
				display: flex;
				flex-direction: column;
				gap: 10px;
				position: relative;
				--flex-direction: row;
				--flex-wrap: wrap;
				--gap: 10px;
				padding: 10px;
			}

			:host(.bordered) {
				border: 1px solid black;
				border-radius: 5px;
			}


			#title {
				border-bottom: 1px solid black;
			}

			#container {
				display: flex;
				flex-direction: var(--flex-direction);
				flex-wrap: var(--flex-wrap);
				gap: var(--gap);

			}

			#id {
				position: absolute;
				top: 5px;
				right: 10px;
			}

			::slotted(fx-name-value-pair) {
				border: 1px solid black;
				border-radius: 5px;
				--separator: 1px solid black;
			}

		
		`;
	}

	set xml(value) { 
		this._xml = value;
		this.id = value.getAttribute('id');
		this.uuidXml = value.querySelector('UUID');
	
	}

	set uuidXml(value) {
		this._uuidXml = value;
		this.uuid = value.textContent;
		// create the modification tag
		let modTag = document.createElement('fx-modification-tag');
		// pass it the xml
		modTag.xml = value;
		// append it to the host in the correct slot
		modTag.slot = 'modification-info';
		this.append(modTag);

	}

	get uuidXml() { 
		return this._uuidXml;
	
	}

	get allXml() {
		// get from the parent app
		const parent = this.closest('fx-app');
		return parent.xml;
	}

	render() {
		if (this.lightDomTemplate) {
			// evaluate the template
			const lightDomContent = this.lightDomTemplate();
			// render the template in the light dom
			render(lightDomContent, this);
		}

		return html`
			<div id='title'><slot name='title'></slot></div>
			<div id="container">
				<div id='id'>${this.id}</div>
				<slot></slot>
			</div>
			<div id='modification-info'>
				<slot name='modification-info'></slot>
			</div>
		`;
	}


}

customElements.define('fx-database-element', FxDatabaseElement);