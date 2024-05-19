import { LitElement, html, css } from 'https://cdn.skypack.dev/lit-element';

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
				top: 0;
				right: 0;
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

	render() {
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