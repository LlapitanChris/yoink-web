// import LitElement from CDN
import { LitElement, html, css } from "https://cdn.skypack.dev/lit-element";

import './FxNameValuePair.js';
import './FxModificationTag.js'


export default class FxBaseTableDetail extends LitElement {
	static get properties() {
		return {
			xml: { type: Object },
			uuid: { type: String, reflect: true },
			id: { type: String, reflect: true },
			name: { type: String,  },
			taglist: { type: String,  },
			fieldCount: { type: Number,  },
			uuidXml: { type: Object },
			fieldCatalog: { type: Object }
		};
	}
	set xml(value) {
		this._xml = value;
		this.id = value.getAttribute('id');
		this.name = value.getAttribute('name');
		this.taglist = value.querySelector('TagList').textContent;
		this.uuid = value.querySelector('UUID').textContent;
		this.uuidXml = value.querySelector('UUID');

	}

	get xml() {
		return this._xml;
	}

	static get styles() {
		return css`
			:host {
				display: block;
				padding: 10px;
				margin: 10px;
				border: 1px solid black;
				position: relative;
				var(--title-size: 1.5em);
			}
			#container {
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;

			}

			#container div {
				margin-right: 10px;
				border: 1px solid black;
			}

			#id {
				font-weight: bold;
				position: absolute;
				top: 0;
				right: 0;
			}

			#fields{
				width: 100%;
			}

			::slotted(fx-field) {
				--title-size: 1em;
			}
			h2{
				font-size: var(--title-size);
			}
		`;

	}

	render() {
		return html`
		<h2>${this.name}</h2>
		<div id='container' uuid=${this.uuid}>
			<div id='id'><a href='/tables?id=${this.id}' @click=${route}>ID: ${this.id}</a></div>
			<div>Tag List: ${this.taglist}</div>
			<div id='fields'>
				<h2>Fields</h2>
				<slot></slot>
			</div>
			<fx-modification-tag .xml=${this.uuidXml}></fx-modification-tag>
		</div>
		`;

	}
}

customElements.define('fx-base-table-detail', FxBaseTableDetail);