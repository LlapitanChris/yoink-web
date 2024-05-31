import { LitElement, html, css, nothing } from 'https://cdn.skypack.dev/lit-element';

// import sub components
import '../components/FxPage.js';
import '../components/FxDataTable.js';
import '../components/FxCalculation.js';
import '../components/FxNodePill.js';

// import the mixin
import { FxDataPageMixin } from '../mixins/FxDataPageMixin.js';

// create the class
const baseClass = FxDataPageMixin(LitElement);

export default class ReferencePage extends baseClass {

	constructor() {
		super();
		this.uuid;
		this.type;
		this.display = 'list'
	}

	static get properties() {
		return {
			id: { type: String },
			display: { type: String, reflect: true },
			type: { type: String, reflect: true }
		}

	}

	createRenderRoot() {
		return this;
	}


	render() {
		// get parameters from url
		super.setPropsFromUrl();

		let headerHTML, references;

		// get the XML
		if (this.uuid && this.type) {
			headerHTML = html`<h1 slot='title'>References for ${this.uuid}</h1>`;
			references = super.xpath(`//${this.type}[@UUID="${this.uuid}"]`, XPathResult.ORDERED_NODE_ITERATOR_TYPE);
		}

		// create a table of the data
		const columnsTemplate = () => {
			return html`
				<tr>
					<th>Reference</th>
				</tr>
			`;
		}

		const rowTemplate = (reference) => {
			const chunksToSkip = ['ObjectList', 'PartsList', 'JoinPredicateList', 'ParameterValues', 'StepsForScripts',
				'ChunkList', 'Chunk', 'value', 'action', 'Conditions', 'JoinPredicate', 'TabPanel', 'ScriptTriggers', 'List'
			]
			const exitWhen = ['AddAction', 'FMSaveAsXML'];
			const templatesArray = [];
			let element = reference;
			let count = 0;

			while (element) {
				// exit if name is in exitWhen or name includes
				// 'Catalog'
				if (exitWhen.includes(element.nodeName) || element.nodeName.includes('Catalog')) {
					break;
				}
				// skip if name is in chunksToSkip
				if (chunksToSkip.includes(element.nodeName)) {
					element = element.parentElement;
					continue;
				}
				if (element.nodeName == element.parentElement.nodeName) {
					element = element.parentElement;
					continue;
				}
				// specific to layoutObjects
				if (
					element.parentElement.nodeName == 'LayoutObject' &&
					element.nodeName == element.parentElement.getAttribute('type').replace(' ', '')
				) {
					element = element.parentElement;
					continue;
				}

				// create a template for the node
				const template = html`${templatesArray.length > 0 ? html`<span> < </span>` : ''}
					<fx-node-pill .node=${element} ?hide-type=${true}></fx-node-pill>`;

				// add the template to the array
				templatesArray.push(template);

				element = element.parentElement;

			}

			if (templatesArray.length === 1) {
				return nothing;
			}

			return html`
				<tr .reference=${reference}>
					<td><div>${templatesArray}</div></td>
				</tr>
			`;
		}

		const tableData = html`
			<fx-data-table .data=${references} .columnsTemplate=${columnsTemplate} .rowTemplate=${rowTemplate}></fx-data-table>
		`;

		return html`
			<fx-page>
				${headerHTML}
				${tableData}
			</fx-page>
		`;

	}

}

customElements.define('fx-reference-page', ReferencePage);