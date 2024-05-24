import { FxDatabaseElementMixin } from "../mixins/FxDatabaseElementMixin.js";
import { LitElement, html, css, nothing } from 'https://cdn.skypack.dev/lit-element';
import './FxCalculation.js';
import './FxPadding.js';


const baseClass = FxDatabaseElementMixin(LitElement);

export default class FxScriptStepRow extends baseClass {

	createRenderRoot() {
		return this;

	}

	static get properties() {
		return {
			id: { type: String },
			scriptId: { type: String },
			name: { type: String },
			options: { type: Object }, // shared options object that keeps track of indent level
		}
	}

	constructor() {
		super();
		this.scriptId = '';
		this.name = '';
	}

	set xmlNode(value) {
		// make sure options is set
		// i don't know why, but the key has to be set 
		if (!this.options.indentLevel && this.options.indentLevel !== 0) {
			console.error('options.indentLevel is required', this, this.options);
			return;
		}
		// pass xml to base class to parse UUID/id info
		super.xmlNode = value;
		this._xmlNode = value;

		// set attributes from xmlNode
		this.scriptId = value.parentNode.parentNode.querySelector('ScriptReference').getAttribute('id');
		this.name = value.getAttribute('name');
		this.index = value.getAttribute('index');
		this.enabled = value.getAttribute('enable') == 'True';
		if (!this.enabled) {
			this.classList.add('disabled');
		}

	}

	get xmlNode() {
		return this._xmlNode;

	}

	render() {
		if (!this.xmlNode) {
			console.error('no xmlNode')
			return;
		}

		this.classList.add('script-step')

		let rowTemplate;
		try {
			switch (this.id) {
				case '1': // perform script
				case '14': // perform script on server
					rowTemplate = this.renderScriptStep();
					break;
				case '6': // go to layout
					rowTemplate = this.renderGoToLayout();
					break;
				case '61': // insert text
					rowTemplate = this.renderInsertText();
					break;
				case '68': // if
					rowTemplate = this.renderIf();
					break;
				case '71': // loop
					rowTemplate = this.renderLoop();
					break;
				case '70': // end if
				case '73': // end loop
					rowTemplate = this.renderEnd();
					break;
				case '72': // exit loop if
					rowTemplate = this.renderExitLoopIf();
					break;
				case '76': // set field
					rowTemplate = this.renderSetField();
					break;
				case '86': // set error capture
				case '85': // allow user abort
					rowTemplate = this.renderSetErrorCapture();
					break;
				case '89': // comment
					rowTemplate = this.renderComment();
					break;
				case '141': // set variable
					rowTemplate = this.renderSetVariable();
					break;
				default: // default
					rowTemplate = this.renderDefault();
					break;
			}
		} catch (error) {
			console.error('Error rendering script step', this, error, this.xmlNode);
		}

		return html`
			<tr>
				<td>${this.index}</td>
				${rowTemplate}
				<td>${this.enabled}</td>
			</tr>
		`;
	}

	getRepetition(repetitionNode) {
		const repetition = repetitionNode.querySelector(`Parameter[type='Target'] repetition`)?.value ||
			repetitionNode.querySelector(`Parameter[type='Target'] repetition Variable Calculation Text`)?.textContent ||
			''
		return `[${repetition}]`;
	}

	renderInsertText() {
		const name = this.xmlNode.querySelector(`Parameter[type='Target'] Variable`).getAttribute('value');
		const repetition = this.getRepetition(this.xmlNode.querySelector(`Parameter[type='Target'] Variable repetition`));
		const calculationText = this.xmlNode.querySelector(`Parameter[type='Text'] Text`)?.getAttribute('value');
		// calculationText.replace(['&#13;', '\n'], ['&#9;', '\t'], ['&quot', '"']);

		return html`
				<td>
					<fx-padding .level=${this.options.indentLevel}></fx-padding>
					${this.name}: ${name} ${repetition} <fx-calculation .calculation=${calculationText}></fx-calculation>
				</td>
		`;

	}

	renderScriptStep() {
		let scriptName, scriptId;
		const type = this.xmlNode.querySelector('Parameter > List')?.getAttribute('name');
		const scriptParameter = this.xmlNode.querySelector(`Parameter[type='Parameter'] Calculation Text`)?.textContent;
		const calculationNode = this.xmlNode.querySelector(`Parameter[type='Parameter'] Calculation`);

		switch (type) {
			case 'By name':
				scriptName = this.xmlNode.querySelector('Parameter > List Calculation Text')?.textContent;
				break;
			case 'From list':
				scriptName = this.xmlNode.querySelector('Parameter > List > ScriptReference')?.getAttribute('name');
				scriptId = this.xmlNode.querySelector('Parameter > List > ScriptReference')?.getAttribute('id');
				this.scriptId = scriptId;
				break;
			default:
				console.error('Unknown script type', `"${type}"`, this.xmlNode, this);
				break;
		}

		this.classList.add('logic');



		return html`
				<td>
					<fx-padding .level=${this.options.indentLevel}></fx-padding>
					${this.name}: 
					${scriptId ?
				html`<a href="/script-step?scriptId=${scriptId}" @click=${route}>${scriptName}</a>`
				: scriptName}
				 <fx-calculation .xmlNode=${calculationNode} .calculation=${scriptParameter}></fx-calculation>
				</td>
		`;
	}

	renderSetField() {
		const tableName = this.xmlNode.querySelector('FieldReference TableOccurrenceReference').getAttribute('name');
		const fieldName = this.xmlNode.querySelector('FieldReference').getAttribute('name');
		const repetition = this.xmlNode.querySelector(`FieldReference repetition`)?.value;
		const calculationNode = this.xmlNode.querySelector(`Parameter[type='Calculation'] Calculation`);

		return html`
				<td>
					<fx-padding .level=${this.options.indentLevel}></fx-padding>
					${this.name}: ${tableName}::${fieldName} ${repetition > 1 ? `[${repetition}]` : ''}
					<fx-calculation .xmlNode=${calculationNode}></fx-calculation>
				</td>
		`;
	}

	renderSetVariable() {
		const name = this.xmlNode.querySelector('Name').getAttribute('value');
		const repetition = this.xmlNode.querySelector(`Parameter[type='variable'] repetition`)?.value;
		const calculationNode = this.xmlNode.querySelector('Calculation');

		return html`
				<td>
					<fx-padding .level=${this.options.indentLevel}></fx-padding>
					${this.name}: ${name} ${repetition ? `[${repetition}]` : ''}
					<fx-calculation .xmlNode=${calculationNode}></fx-calculation>
				</td>
		`;

	}

	renderGoToLayout() {
		// get layoutReferenceContainer
		const type = this.xmlNode.querySelector('LayoutReferenceContainer').getAttribute('value');
		let layoutName;
		switch (type) {
			case '1': // original layout
				layoutName = '[Original Layout]';
				break;
			case '5': // layout reference
				layoutName = this.xmlNode.querySelector(`Parameter[type='LayoutReferenceContainer'] LayoutReference`).getAttribute('name');
				break;
			case '3': // calculated name (in square brackets)
				layoutName = `[${this.xmlNode.querySelector(`Parameter[type='LayoutReferenceContainer'] Calculation Text`).textContent}]`;
				break;
		}

		return html`
			<td>
				<fx-padding .level=${this.options.indentLevel}></fx-padding>
				${this.name}: ${layoutName}
			</td>
		`;
	}

	renderIf() {
		const calculationNode = this.xmlNode.querySelector('Calculation');

		this.classList.add('logic');

		return html`
			<td>
				<fx-padding .level=${this.options.indentLevel++}></fx-padding>
				${this.name}: <fx-calculation .xmlNode=${calculationNode}></fx-calculation>
			</td>
		`;

	}

	renderLoop() {
		this.classList.add('logic');

		return html`
			<td>
				<fx-padding .level=${this.options.indentLevel++}></fx-padding>
				${this.name}
			</td>
		`;


	}

	renderEnd() {
		this.classList.add('logic');

		return html`
			<td>
				<fx-padding .level=${--this.options.indentLevel}></fx-padding>
				${this.name}
			</td>
		`;

	}

	renderExitLoopIf() {
		const calculationNode = this.xmlNode.querySelector('Calculation');

		this.classList.add('logic');

		return html`
			<td>
				<fx-padding .level=${this.options.indentLevel}></fx-padding>
				${this.name}: <fx-calculation .xmlNode=${calculationNode}></fx-calculation>
			</td>
		`;


	}

	renderSetErrorCapture() {
		const value = this.xmlNode.querySelector('Boolean').getAttribute('value');

		return html`
			<td>
				<fx-padding .level=${this.options.indentLevel}></fx-padding>
				${this.name}: [${value}]
			</td>
		`;


	}

	renderComment() {
		const value = this.xmlNode.querySelector('Comment').getAttribute('value');

		this.classList.add('comment');

		return html`
			<td>
				<fx-padding .level=${this.options.indentLevel}></fx-padding>
				# ${value || nothing}
			</td>
		`;


	}

	renderDefault() {
		const calculationNode = this.xmlNode.querySelector('Calculation');

		return html`
			<td>
				<fx-padding .level=${this.options.indentLevel}></fx-padding>
				${this.name}
				${calculationNode ?
				html`<fx-calculation .xmlNode=${calculationNode}></fx-calculation>`
				: nothing
			}
			</td>
		`;


	}


}

customElements.define('fx-script-step-row', FxScriptStepRow);