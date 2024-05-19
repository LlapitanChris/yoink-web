// import LitElement from CDN
import { LitElement, html, css, render } from "https://cdn.skypack.dev/lit-element";
import './FxNameValuePair.js';
import './FxModificationTag.js';
import './FxDatabaseElement.js';
import FxDatabaseElement from "./FxDatabaseElement.js";

/* this is the template for the base table xml
 * 	<BaseTable id="130" name="Base Table">
 *	<UUID modifications="2" userName="Kaz McLamore" accountName="Admin" timestamp="2022-04-27T17:37:14">0B7B33AA-F7F2-40BA-B5C9-22BE3D1280B1</UUID>
 *	<TagList></TagList>
 *	</BaseTable>
 */


export default class FxBaseTable extends FxDatabaseElement {

	constructor() {
		super();
		this._xml;
		this.name = '';
		this.taglist = '';
		this.fieldCount = 0;
		this.fieldCatalog = {};
	}

	static get properties() {
		return {
			name: { type: String, },
			taglist: { type: String, },
			fieldCount: { type: Number, },
			occurrenceCount: { type: Number },
			fieldCatalog: { type: Object },
		};
	}

	set xml(value) { 
		super.xml = value;
		this._xml = value;
		try {
			this.name = value.getAttribute('name');
			this.taglist = value.querySelector('TagList').textContent;
		} catch (error) {
			console.error('error setting xml', error);
			console.debug('xml', value)
		}
		
	
	}

	get xml() { 
		return this._xml;
	}

	static get styles() {
		return [
			super.styles,
			css`


		`];

	}

	lightDomTemplate() {
		return html`
			<h2 slot='title'><a href='/tables?id=${this.id}' @click=${route}>${this.name}</a></h2>
			<fx-name-value-pair .name=${`tags`}>${this.taglist||'none'}</fx-name-value-pair>
			<fx-name-value-pair .name=${`fields`}>${this.fieldCount}</fx-name-value-pair>
			<fx-name-value-pair .name=${`occurrences`}>${this.occurrenceCount}</fx-name-value-pair>
		`;
	}


}

customElements.define('fx-base-table', FxBaseTable);