import { LitElement, html } from 'https://cdn.skypack.dev/lit-element';
import { FxDataPageMixin } from "../mixins/FxDataPageMixin.js";
import { classMap } from 'https://cdn.skypack.dev/lit-html/directives/class-map';
import '../components/FxPage.js';
import '../components/FxField.js';
import '../components/FxElementList.js';

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

	createRenderRoot() {
		return this;
	}

	render() {
		// get parameters from url
		super.setPropsFromUrl();

		let headerHTML, fieldNodes;
		// get the XML Nodes
		if (this.id) {
			
		} else if (this.tableId) {
			
		} else {
			headerHTML = html`<h1 slot='title'>Field List</h1>`;
			fieldNodes = super.xpath(
				'//AddAction//FieldCatalog/ObjectList/Field',
				XPathResult.ORDERED_NODE_ITERATOR_TYPE
			);
		}

		// create the fields from the xml
		let fieldNode = fieldNodes.iterateNext();
		const fieldTemplatesArray = [];
		while (fieldNode) {
			const fieldTemplate = html`
				<fx-field .xmlNode=${fieldNode} .xmlDocument=${this.xmlDocument}></fx-field>`;
			fieldTemplatesArray.push(fieldTemplate);
			fieldNode = fieldNodes.iterateNext();
		}

		const classes = {
			grid: this.display === 'grid',
			list: this.display === 'list',
			flex: this.display === 'flex'
		}

		return html`
		
		<fx-page>
			${headerHTML}
			<fx-element-list class="${classMap(classes)}">
				${fieldTemplatesArray}
			</fx-element-list>
		</fx-page>
		`
	}


}

customElements.define('fx-field-page', FieldsPage);