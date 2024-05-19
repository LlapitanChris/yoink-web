// import LitElement from CDN
import { LitElement, html, css } from "https://cdn.skypack.dev/lit-element";
import './FxNameValuePair.js';
import './FxModificationTag.js';
import './FxDatabaseElement.js';

/* this is the template for the base table xml
 * 	<BaseTable id="130" name="Base Table">
 *	<UUID modifications="2" userName="Kaz McLamore" accountName="Admin" timestamp="2022-04-27T17:37:14">0B7B33AA-F7F2-40BA-B5C9-22BE3D1280B1</UUID>
 *	<TagList></TagList>
 *	</BaseTable>
 */


export default class FxBaseTable extends LitElement {

	constructor() {
		super();
		this._xml = null;
		this.id = '';
		this.name = '';
		this.taglist = '';
		this.fieldCount = 0;
		this.fieldCatalog = {};
		this.modData = { modCount: 0, username: '', accountname: '', timestamp: ''};
	}

	static get properties() {
		return {
			xml: { type: Object },
			uuid: { type: String, reflect: true },
			id: { type: String, reflect: true },
			name: { type: String, },
			taglist: { type: String, },
			fieldCount: { type: Number, },
			occurrenceCount: { type: Number },
			fieldCatalog: { type: Object },
			uuidXml: { type: Object }
		};
	}

	set xml(value) { 
		this._xml = value;
		try {
			this.id = value.getAttribute('id');
			this.name = value.getAttribute('name');
			this.taglist = value.querySelector('TagList').textContent;
			this.uuid = value.querySelector('UUID').textContent;
			this.uuidXml = value.querySelector('UUID');
		} catch (error) {
			console.error('error setting xml', error);
			console.debug('xml', value)
		}
		
	
	}

	get xml() { 
		return this._xml;
	}

	static get styles() {
		return css`
			:host {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				padding: 10px;
				border: 1px solid black;
				border-radius: 5px;
				position: relative;
				--title-size: 1.5em;
				overflow: hidden;
			}
			#container {
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				gap: 5px;
				align-items: flex-end;
				height: 100%;

			}

			#id {
				font-weight: 300;
				position: absolute;
				top: 5px;
				right: 5px;
			}

			a {
				text-decoration: none;
				color: inherit;
			}

			a:hover{
				color: rgb(139, 151, 251)

			}

			h2{
				font-size: var(--title-size);
				font-weight: 400;
				margin: .25rem 0 .5rem 0;
			}

			fx-name-value-pair {
				border: 1px solid black;
				border-radius: 5px;
				--value-white-space: nowrap;
				--separator: 1px solid black;
			}
		`;

	}

	// render() {
	// 	return html`
	// 	<h2><a href='/tables?id=${this.id}' @click=${route}>${this.name}</a></h2>
	// 	<div id='container' uuid=${this.uuid}>
	// 	<div id='id'>${this.id}</div>
	// 	<fx-name-value-pair .name=${`tags`}>${this.taglist||'none'}</fx-name-value-pair>
	// 	<fx-name-value-pair .name=${`fields`}>${this.fieldCount}</fx-name-value-pair>
	// 	<fx-name-value-pair .name=${`occurrences`}>${this.occurrenceCount}</fx-name-value-pair>
	// 		<fx-modification-tag .xml=${this.uuidXml}></fx-modification-tag>
	// 	</div>
	// 	`;

	// }

	render() {
		return html`
			<fx-database-element .xml=${this.xml}>
				<a slot='title' href='/tables?id=${this.id}' @click=${route}>${this.name}</a>
				<fx-name-value-pair .name=${`tags`}>${this.taglist||'none'}</fx-name-value-pair>
				<fx-name-value-pair .name=${`fields`}>${this.fieldCount}</fx-name-value-pair>
				<fx-name-value-pair .name=${`occurrences`}>${this.occurrenceCount}</fx-name-value-pair>
			</fx-database-element>
		`;
	}
}

customElements.define('fx-base-table', FxBaseTable);