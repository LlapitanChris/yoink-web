import { LitElement, html } from 'https://cdn.skypack.dev/lit-element';
import { FxDataPageMixin } from "../mixins/FxDataPageMixin.js";
import '../components/FxField.js';
import FxField from '../components/FxField.js';

const baseClass = FxDataPageMixin(LitElement);

export default class FieldsPage extends baseClass {

	constructor() {
		super();
		this.id;
		this.tableId;
		this.display = 'list'
	}

	static get properties() {
		return {
			id: { type: String },
			display: { type: String, reflect: true },
			tableId: { type: String }
		}

	}

	get xpathString() {
		if (this.id) {
			return `//AddAction//FieldCatalog/ObjectList/Field[@id='${this.id}']`;
		} else if (this.tableId) {
			return `//AddAction//FieldCatalog/BaseTableReference[@id='${this.tableId}']/following-sibling::ObjectList/Field`;
		} else {
			return '//AddAction//FieldCatalog/ObjectList/Field';
		}

	}

	// define header template,
	// this will be called by the mixin render function
	headerTemplate() {
		if (this.id) {
			return html`<h1 slot='title'>Field ${this.id}</h1>`;
		} else if (this.tableId) {
			return html`<h1 slot='title'>Field List for Table ${this.tableId}</h1>`;
		} else {
			return html`<h1 slot='title'>Field List</h1>`;
		}
	}

	// define elements template,
	// this will be called by the mixin render function
	elementsTemplate() {
		return super.createComponentsFromXml(this.xpathString, 'fx-field');
	}




}

customElements.define('fx-field-page', FieldsPage);