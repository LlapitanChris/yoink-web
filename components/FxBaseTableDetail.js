// import LitElement from CDN
import { LitElement, html, css } from "https://cdn.skypack.dev/lit-element";



export default class FxBaseTableDetail extends LitElement {
	static get properties() {
		return {
			xml: { type: Object },
			uuid: { type: String, reflect: true },
			id: { type: String, reflect: true },
			name: { type: String,  },
			taglist: { type: String,  },
			fieldCount: { type: Number,  },
			modifications: { type: String,  },
			username: { type: String,  },
			accountname: { type: String,  },
			fieldCatalog: { type: Object }
		};
	}
	set xml(value) {
		this._xml = value;
		this.id = value.getAttribute('id');
		this.name = value.getAttribute('name');
		this.taglist = value.querySelector('TagList').textContent;
		this.modifications = value.querySelector('UUID').getAttribute('modifications');
		this.username = value.querySelector('UUID').getAttribute('userName');
		this.accountname = value.querySelector('UUID').getAttribute('accountName');
		this.uuid = value.querySelector('UUID').textContent;

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
		`;

	}

	render() {
		return html`
		<h2>${this.name}</h2>
		<div id='container' uuid=${this.uuid}>
			<div id='id'><a href='/tables?id=${this.id}' @click=${route}>ID: ${this.id}</a></div>
			<div>Position: ${this.position}</div>
			<div>Modifications: ${this.modifications}</div>
			<div>Username: ${this.username}</div>
			<div>Account Name: ${this.accountname}</div>
			<div>Tag List: ${this.taglist}</div>
			<div id='fields'>
				<h2>Fields</h2>
				<slot></slot>
			</div>
		</div>
		`;

	}
}

customElements.define('fx-base-table-detail', FxBaseTableDetail);