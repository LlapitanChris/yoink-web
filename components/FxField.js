import { LitElement, html, nothing } from 'https://cdn.skypack.dev/lit-element';
import './FxNameValuePair.js'
import './FxDatabaseElement.js'
import { FxDatabaseElementMixin } from '../mixins/FxDatabaseElementMixin.js';

/* <Field id="15" name="UUID userName" fieldtype="Normal" datatype="Text" comment="">
	<UUID modifications="2" userName="Kaz McLamore" accountName="Admin" timestamp="2022-06-04T13:56:49">A185470B-51F3-4036-9A4F-A4607B1B18DD</UUID>
	<AutoEnter type="" prohibitModification="False"></AutoEnter>
	<Validation type="OnlyDuringDataEntry" allowOverride="True" notEmpty="False" unique="False" existing="False"></Validation>
	<Storage autoIndex="True" index="None" global="False" maxRepetitions="1">
		<LanguageReference name="English" id="21"></LanguageReference>
	</Storage>
	<TagList></TagList>
</Field> */


// add mixins
let baseClass = LitElement;
baseClass = FxDatabaseElementMixin(baseClass);


export default class FxField extends baseClass {

	constructor() {
		super();
		this.autoenter = { prohibitModification: '', type: '' };

	}

	static get properties() {
		return {
			autoenter: { type: Object, state: true },

		}
	}

	set xmlNode(value) {
		super.xmlNode = value;
		console.log('FxField xmlNode', value);
		if (!value) {
			console.error('no xml node passed to FxField');
			return;
		}
		this.fieldType = value.getAttribute('fieldtype');
		this.dataType = value.getAttribute('datatype');
		this.autoenter.prohibitModification = value.querySelector('AutoEnter')?.getAttribute('prohibitModification');
		this.autoenter.type = value.querySelector('AutoEnter')?.getAttribute('type');
		this.isAutoEnter = this.autoenter.type ? true : false;

	}

	createRenderRoot() { 
		return this;
	
	}

	render() {
		return html`
		<fx-database-element class='bordered' .id=${this.id}>
			<h2 slot='title'>${this.name}</h2>
			<fx-name-value-pair .name=${`Field Type`}>${this.fieldType}</fx-name-value-pair>
			<fx-name-value-pair .name=${`Data Type`}>${this.dataType}</fx-name-value-pair>
			${
			this.isAutoEnter ?
				html`
				<fx-name-value-pair .name=${`AutoEnter`}>
					<fx-name-value-pair .name=${`Type`}>${this.autoenter.type}</fx-name-value-pair>
					<fx-name-value-pair .name=${`Prohibit Modification`}>${this.autoenter.prohibitModification}</fx-name-value-pair>
				</fx-name-value-pair>
				` : nothing
			}
			${this.renderModificationTag()}
		</fx-database-element>
		`;

	}
}

customElements.define('fx-field', FxField);