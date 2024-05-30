import { LitElement, html } from 'https://cdn.skypack.dev/lit-element';

// import sub components
import '../components/FxPage.js';
import '../components/FxDataTable.js';
import '../components/FxCalculation.js';

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
			console.log(references);
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
				'ChunkList', 'Chunk', 'value', 'action', 'Conditions', 'JoinPredicate'
			]
			const exitWhen = ['AddAction', 'FMSaveAsXML'];
			const templatesArray = [];
			let element = reference;

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
				if (element.nodeName === element.parentElement.nodeName) {
					element = element.parentElement;
					continue;
				}


				// create a template for the node
				const template = html`
					${templatesArray.length > 0 ? html`<span> < </span>` : ''}
					${element.nodeName === 'Calculation' ?
						html`<span class='element'><fx-calculation .xmlNode=${element}></fx-calculation></span>` :
						html`<span class='element'>${this.getElementTitle(element)}</span>`
					}
				`;

				// add the template to the array
				templatesArray.push(template);

				element = element.parentElement;

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

	getElementTitle(element) {
		const nodeName = element.nodeName;
		const name = element.getAttribute('name');
		switch (nodeName) {
			case 'Script':
				let scriptName = element.querySelector('ScriptReference').getAttribute('name');
				return `Script: ${scriptName}`;
			case 'Step':
				return `Step: ${name}`;
			default:
				return nodeName;
		}
	}

}

customElements.define('fx-reference-page', ReferencePage);