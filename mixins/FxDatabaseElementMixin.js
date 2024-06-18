
import { html } from 'https://cdn.skypack.dev/lit-element';

export const FxDatabaseElementMixin = (superclass) => class extends superclass { 
	constructor() {
		super();
		this._xmlNode;
		this._xmlDocument;
		this._uuidXml;
	}

	static get properties() {
		return {
			xmlNode: { type: Object },
			xmlDocument: { type: Object },
			uuidXml: { type: Object },
			id: { type: String },
			uuid: { type: String, reflect: true },
		}
	}

	set xmlNode(value) {
		if (!value) {
			console.error('no xml node passed to FxDatabaseElementMixin');
			return;
		}
		
		this._xmlNode = value;
		// get the id, name
		this.id = value.getAttribute('id');
		this.name = value.getAttribute('name');

		// get the UUID node
		this.uuidXml = value.querySelector('UUID');
	}

	set uuidXml(value) { 
		this._uuidXml = value;
		// sometimes a uuid is not present
		if (!this._uuidXml) {
			console.error(`no UUID node found in xml for ${this.name}: ${this.id}`, this._xml);
			return;
		
		};

		this.uuid = this._uuidXml.textContent;
	
	}

	get xmlNode() {
		return this._xmlNode;
	}

	get uuidXml() {
		return this._uuidXml;
	}

	renderModificationTag() {
		return html`<fx-modification-tag .xml=${this.uuidXml} slot='modification-info'></fx-modification-tag>`;
	}

	xpath(query, type) {
		if (!this.xmlDocument) {
			console.error(`no xml document to evaluate xpath query ${query}`);
			return;
		}
		return this.xmlDocument.evaluate(query, this.xmlDocument, null, type, null);
	}

}