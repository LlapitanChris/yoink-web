// import LitElement from CDN
import { LitElement, html, css } from "https://cdn.skypack.dev/lit-element";

/* this is the template for the base table xml
 * 	<BaseTable id="130" name="Base Table">
 *	<UUID modifications="2" userName="Kaz McLamore" accountName="Admin" timestamp="2022-04-27T17:37:14">0B7B33AA-F7F2-40BA-B5C9-22BE3D1280B1</UUID>
 *	<TagList></TagList>
 *	</BaseTable>
 */


export default class FxBaseTable extends LitElement {
	static get properties() {
		return {
			xml: { type: Object },
			uuid: { type: String, reflect: true },
			id: { type: String, reflect: true },
			name: { type: String, },
			taglist: { type: String, },
			fieldCount: { type: Number, },
			modifications: { type: String, },
			username: { type: String, },
			accountname: { type: String, },
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
				var(--title-size: 1.5em);
			}
			#container {
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				gap: 5px;

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
			<div>Modifications: ${this.modifications}</div>
			<div>Username: ${this.username}</div>
			<div>Account Name: ${this.accountname}</div>
			<div>Tags: ${this.taglist}</div>
			<div>Fields: ${this.fieldCount}</div>
		</div>
		`;

	}
}

customElements.define('fx-base-table', FxBaseTable);