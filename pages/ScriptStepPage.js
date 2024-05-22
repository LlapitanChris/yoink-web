import { LitElement, html, nothing } from 'https://cdn.skypack.dev/lit-element';
import { FxDataPageMixin } from "../mixins/FxDataPageMixin.js";
import '../components/FxDataTable.js';
import '../components/FxCalculation.js';

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




		if (this.id) {
			const item = super.xpath(this.xpathString, XPathResult.FIRST_ORDERED_NODE_TYPE).singleNodeValue;
			return html`
				<fx-page>
					${this.headerTemplate()}
					<div>
						<p>${item.getAttribute('name')}: ${item.getAttribute('id')}</p>
					</div>
				</fx-page>
			`;
		}

		const columnHeaderTemplate = () => {
			return html`
				<tr>
					<th>Index</th>
					<th></th>
					<th>Enabled</th>
				</tr>
			`;
		}

		const rowTemplate = (item, options) => {


			const name = item.getAttribute('name')
			const id = item.getAttribute('id')
			const index = item.getAttribute('index')
			const enabled = item.getAttribute('enable') == 'True'
			let text = '';
			let increment = false, decrement = false;
			let className = '';
			let calculationText = ''

			if (name == 'Set Variable') {

				text = `${name}: ${item.querySelector('Name').getAttribute('value')}:`
				calculationText = item.querySelector('Calculation Text')?.textContent;

			} else if (id == '1' || id == '10') {
				// perform script, PSOS
				if (item.querySelector('ScriptReference')) {
					text = item.querySelector('ScriptReference').getAttribute('name');
					text = `"${text}"`;
				} else {
					calculationText = item.querySelector('Calculation Text')?.textContent;
				}
				className = 'logic'
				text = `${name}: ${text}`

			} else if (id == '6') {
				// determine type of reference
				const referenceContainer = item.querySelector('LayoutReferenceContainer')
				if (referenceContainer.querySelector('Label')) {
					text = referenceContainer.querySelector('Label').textContent;
				} else if (referenceContainer.querySelector('LayoutReference')) {
					text = referenceContainer.querySelector('LayoutReference').getAttribute('name');
				} else {
					calculationText = referenceContainer.querySelector('Calculation Text').textContent;
				}
				// go to layout
				text = `${name}: ${text || nothing}`

			} else if (id == '68') {
				increment = true;
				// if
				text = `${name}: `

				calculationText = `${item.querySelector('Calculation Text')?.textContent}`
				className = 'logic'
			} else if (id == '71') {
				// loop
				increment = true;
				text = `${name}`;
				className = 'logic'
			} else if (id == '70' || id == '73') {
				// end if, end loop
				decrement = true;
				text = `${name}`
				className = 'logic'
			} else if (id == '89') {
				// comment
				text = `# ${item.querySelector('Comment').getAttribute('value') || ''}`
				className = 'comment'
			} else if (id == '72') {
				// exit loop if
				text = `${name}: ${item.querySelector('Calculation Text')?.textContent}`
				className = 'logic'
			} else if (id == '86' || id == '85') {
				// set error capture
				text = `${name}: [${item.querySelector('Boolean').getAttribute('value') == 'True'}]`
			} else {
				if (item.querySelector('Calculation Text')) {
					calculationText = item.querySelector('Calculation Text').textContent;
				} else {
					text = '';
				}
				text = `${name} ${text}`
			}

			// decrement before padding
			if (decrement) {
				options.indentLevel--;
			}
			const leadingSpaces = '  '.repeat(options.indentLevel);
			const preTemplate = options.indentLevel > 0 ? html`<pre class='padding'>${leadingSpaces}</pre>` : '';

			// increment after padding
			if (increment) {
				options.indentLevel++;
			}
			const template = html`
				<td>${index}</td>
				<td>${preTemplate}${text}
				${calculationText ?
					html`<fx-calculation .calculation=${calculationText}></fx-calculation>`
					: nothing
				}
				</td>
				<td>${enabled}</td>
			`;

			return html`
				<tr .rowObject=${item} class=${className}>
					${template}
				</tr>
			`;
		}

		const dataTableTemplate = html`
			<fx-data-table .data=${super.xpath(this.xpathString, XPathResult.ORDERED_NODE_ITERATOR_TYPE)} .columnsTemplate=${columnHeaderTemplate} .rowTemplate=${rowTemplate}></fx-data-table>
		`;

		return html`
			<fx-page>
				${this.headerTemplate()}
				${dataTableTemplate}
			</fx-page>
		`;

	}

}

customElements.define('fx-script-step-page', FxScriptStepPage);