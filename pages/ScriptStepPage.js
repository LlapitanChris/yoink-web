import { LitElement, html, nothing } from 'https://cdn.skypack.dev/lit-element';
import { FxDataPageMixin } from "../mixins/FxDataPageMixin.js";
import '../components/FxDataTable.js';
import '../components/FxCalculation.js';
import '../components/FxScriptStepRow.js';

const baseClass = FxDataPageMixin(LitElement);

export default class FxScriptStepPage extends baseClass {

	constructor() {
		super();
		this.id;
		this.display = 'list'
	}

	static get properties() {
		return {
			id: { type: String },
			scriptId: { type: String },
			display: { type: String, reflect: true },
		}

	}

	get xpathString() {
		if (this.scriptId) {
			return `//AddAction//StepsForScripts/Script/ScriptReference[@id=${this.scriptId}]/following-sibling::ObjectList/Step`;
		} else if (this.uuid) {
			return `//AddAction//StepsForScripts/Script/ObjectList/Step/UUID/text()='${this.uuid}'/parent::Step`;
		} else {
			return `//AddAction//StepsForScripts/Script/ObjectList/Step`;
		}

	}

	// define header template,
	// this will be called by the mixin render function
	headerTemplate() {
		if (this.scriptId) {
			return html`<h1 slot='title'>Steps for Script ${this.scriptId}</h1>`;
		} else if (this.uuid) {
			return html`<h1 slot='title'>Step ${this.uuid}</h1>`;
		} else {
			return html`<h1 slot='title'>Script Steps</h1>`;
		}
	}

	render() {
		// get parameters from url
		super.setPropsFromUrl();

		const columnsTemplate = () => html`
			<tr>
				<th>index</th>
				<th></th>
				<th>enabled</th>
			</tr>
		`


		const rowTemplate = (step, options) => html`
			<fx-script-step-row
			.options=${options}
			.xmlDocument=${this.xmlDocument}
			.xmlNode=${step}
			>
			</fx-script-step-row>
		`

		if (this.uuid) {
			const step = super.xpath(this.xpathString, XPathResult.FIRST_ORDERED_NODE_TYPE).singleNodeValue;
			return html`
				<fx-page>
					${this.headerTemplate()}
					<fx-script-step .xmlNode=${step} .xmlDocument=${this.xmlDocument}></fx-script-step>
				</fx-page>
			`;
		} 

		const steps = super.xpath(this.xpathString, XPathResult.ORDERED_NODE_ITERATOR_TYPE);
		return html`
				<fx-page>
					${this.headerTemplate()}
					<fx-data-table .data=${steps} 
					.columnsTemplate=${columnsTemplate}
					.rowTemplate=${rowTemplate}></fx-data-table>
				</fx-page>
			`;

	}


}

customElements.define('fx-script-step-page', FxScriptStepPage);