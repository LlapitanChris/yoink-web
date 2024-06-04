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

	static chunksToSkip = [
		'ObjectList', 'PartsList', 'JoinPredicateList', 'ParameterValues', 'StepsForScripts',
		'ChunkList', 'Chunk', 'value', 'action', 'Conditions', 'JoinPredicate', 'TabPanel', 'ScriptTriggers', 'List',

	]

	static rootNodeNames = [
		'AddAction',
		'FMSaveAsXML',
	]


	render() {
		// get parameters from url
		super.setPropsFromUrl();

		let headerHTML, references = [];

		// get the XML nodes
		if (this.uuid && this.type) {
			headerHTML = html`<h1 slot='title'>References for ${this.uuid}</h1>`;
			const referenceNodes = super.xpath(`//${this.type}[@UUID="${this.uuid}"]`, XPathResult.ORDERED_NODE_ITERATOR_TYPE);

			// translate into array
			while (referenceNodes.iterateNext()) {
				references.push(referenceNodes.iterateNext());
			}	

			console.assert(references.length > 0, 'No references found')
		}

		// create a table of the data
		const columnsTemplate = () => {
			return html`
				<tr>
					<th>All References</th>
				</tr>
			`;
		}


		const getElementAncestors = (element) => {

			const chunksToSkip = ReferencePage.chunksToSkip;
			const exitWhen = ReferencePage.rootNodeNames;
			const ancestors = [];

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
				// skip if this node is the same name as the parent,
				// the parent element is what we want.
				if (element.nodeName == element.parentElement.nodeName) {
					element = element.parentElement;
					continue;
				}
				// specific to layoutObjects
				// if the parent is a layoutObject and the element is the same type as the parent
				// then the parent is what we want.
				if (
					element.parentElement.nodeName == 'LayoutObject' &&
					element.nodeName == element.parentElement.getAttribute('type').replace(' ', '')
				) {
					element = element.parentElement;
					continue;
				}

				// add the element to the ancestors array
				ancestors.push(element);

				// iterate to the next parent element
				element = element.parentElement;

			}

			// if there are no ancestors, return nothing
			if (ancestors.length <= 1) {
				return nothing;
			}

			return ancestors;
		}

		// sort all the references by the last element name
		const sortReferences = (references) => {
			const dictionary = new Map();
			for (const reference of references) {
				const ancestors = getElementAncestors(reference);
				if (ancestors == nothing) {
					continue;
				}
				const lastElement = ancestors[ancestors.length - 1];
				const lastElementName = lastElement.nodeName;
				if (!dictionary.has(lastElementName)) {
					dictionary.set(lastElementName, []);
				}
				dictionary.get(lastElementName).push(reference);

			}

			return dictionary;
		}

		const rowTemplate = (reference) => {
			const templatesArray = [];
			const ancestors = getElementAncestors(reference);
			for (const ancestor of ancestors) {

				templatesArray.push(html`
					<fx-node-pill .node=${ancestor} ?hide-type=${true}></fx-node-pill>`);
			}

			if (templatesArray.length === 1) {
				return nothing;
			}

			return html`
				<tr .reference=${reference}>
					<td><div>${templatesArray}</div></td>
				</tr>
			`

		}

		// take the sorted references and create the group data
		// array of objects with templateFunction and data
		const createGroupData = (references) => {
			const sortedReferences = sortReferences(references);
			const groupData = [];
			for (const [groupName, nodes] of sortedReferences) {
				const value = nodes;
				const templateFunction = (data) => {
					return html`
						<tbody class ='tbody-group ${groupName}'>
							<tr class='group-header-row'>
								<th>${groupName} (${data.length})</th>
							</tr>
							${data.map(reference => rowTemplate(reference))}
						</tbody>
					`;
				}
				groupData.push({ templateFunction, data: value });
			}
			return groupData;
		}

		// create the group data
		const groupData = createGroupData(references);


		const tableData = html`
			<fx-data-table
			.groupData=${groupData} 
			.columnsTemplate=${columnsTemplate} 
			></fx-data-table>
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