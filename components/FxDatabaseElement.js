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
			id: { type: String },
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
				justify-content: space-between;
				gap: 10px;
				position: relative;
				--flex-direction: row;
				--flex-wrap: wrap;
				--gap: 10px;
				--padding-top: 30px;
				height: 100%;
				padding-top: var(--padding-top);
				padding-bottom: var(--padding-top);
				padding-left: 10px;
				padding-right: 10px;
			}

			:host(.bordered) {
				border: 1px solid black;
				border-radius: 5px;
			}


			#title {
				border-bottom: 1px solid black;
				padding-bottom: 5px;
				margin-bottom: 5px;
			}

			#container {
				display: flex;
				flex-direction: var(--flex-direction);
				flex-wrap: var(--flex-wrap);
				gap: var(--gap);

			}

			#id {
				position: absolute;
				top: var(--padding-top);
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
		if (!value) {
			console.log(`element ${this.id} has no uuid node`, this._xml);
			return;
		}
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

	render() {
		if (this.lightDomTemplate) {
			// evaluate the template
			// render the template in the light dom
			render(this.lightDomTemplate(), this);
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