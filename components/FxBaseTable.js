// import LitElement from CDN
import { LitElement, html, css, nothing } from "https://cdn.skypack.dev/lit-element";
import { classMap } from "https://cdn.skypack.dev/lit-html/directives/class-map.js";
import './FxNameValuePair.js';
import './FxField.js';
import './FxDatabaseElement.js';
import './FxTableOccurrence.js';

// get mixins
import { FxDatabaseElementMixin } from "../mixins/FxDatabaseElementMixin.js";

/* this is the template for the base table xml
 * 	<BaseTable id="130" name="Base Table">
 *	<UUID modifications="2" userName="Kaz McLamore" accountName="Admin" timestamp="2022-04-27T17:37:14">0B7B33AA-F7F2-40BA-B5C9-22BE3D1280B1</UUID>
 *	<TagList></TagList>
 *	</BaseTable>
 */

let baseClass = LitElement;
baseClass = FxDatabaseElementMixin(baseClass);

export default class FxBaseTable extends baseClass {

	constructor() {
		super();
		this.taglist = '';
		this.fieldCatalog = {};
		this.showingFields = false;
		this.detailType = null;
	}

	static get properties() {
		return {
			taglist: { type: String, },
			fieldCount: { type: Number, },
			occurrenceCount: { type: Number },
			fieldsXml: { type: Object },
			detailType: { type: String, reflect: true },
		};
	}

	set xmlNode(value) { 
		// pass xml to base class to render UUID/id info
		super.xmlNode = value;
		try {
			this.taglist = value.querySelector('TagList').textContent;
		} catch (error) {
			console.error('error setting xml', error);
			console.debug('xml', value)
		}
		
	
	}

	get fieldCount() { 
		if (!this.xmlDocument) return 0;
		return super.xpath(
			`//AddAction//FieldCatalog/BaseTableReference[@UUID='${this.uuid}']/following-sibling::ObjectList/@membercount`,
			XPathResult.NUMBER_TYPE).numberValue;
	}

	get fieldsXml() {
		// if no xml document return nothing
		if (!this.xmlDocument) {
			console.error('no xml document');
			return nothing;
		};
		// build xpath query
		const xpath = `//AddAction//FieldCatalog/BaseTableReference[@UUID='${this.uuid}']/following-sibling::ObjectList/Field`;
		// get the fields
		const catalog = super.xpath(xpath, XPathResult.ORDERED_NODE_ITERATOR_TYPE);
		// return xpath result
		return catalog;
	}

	get occurrenceXml() {
		if (!this.xmlDocument) return nothing;

		return super.xpath(
			`//TableOccurrenceCatalog//BaseTableSourceReference/BaseTableReference[@UUID='${this.uuid}']/ancestor::TableOccurrence`,
			XPathResult.ORDERED_NODE_ITERATOR_TYPE);
	
	}

	get occurrenceCount() { 
		if (!this.xmlDocument) return 0;

		return super.xpath(
			`//TableOccurrenceCatalog//BaseTableSourceReference/BaseTableReference[@UUID='${this.uuid}']/ancestor::TableOccurrence`,
			 XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE).snapshotLength;
	}

	createRenderRoot() {
		return this;
	}

	render() {
		const detailClasses = {
			'detail-viewer': true,
			'hidden': !this.detailType,

		};
		return html`
			<fx-database-element class='bordered' .id=${this.id}>
			<h2 slot='title'><a href='/table?id=${this.id}' @click=${route}>${this.name}</a></h2>
			<fx-name-value-pair .name=${`tags`}>${this.taglist || 'none'}</fx-name-value-pair>
			
			<fx-name-value-pair .name=${`fields`} 
				@click=${this.toggleDetailType.bind(this, 'fields')} 
				class='link'
			>${this.fieldCount}
			</fx-name-value-pair>
				
			<fx-name-value-pair .name=${`occurrences`} 
				@click=${this.toggleDetailType.bind(this, 'occurrences')} 
				class='link'
			>${this.occurrenceCount}
			</fx-name-value-pair>

			${
			this.detailType == null ? nothing :
			html`
			<div class=${classMap(detailClasses)}>
					${this.detailTemplate()}
				</div>`
			}
				

			${this.renderModificationTag()}
			</fx-database-element>
		`;
	}

	fieldsTemplate() {
		const catalog = this.fieldsXml;
		let item = catalog.iterateNext();
		let templates = []
		while (item) {
			const template = html`<fx-field .xmlNode=${item} .xmlDocument=${this.xmlDocument}></fx-field>`;
			templates.push(template);
			item = catalog.iterateNext();
		}

		return templates;
	}

	occurrencesTemplate() {
		const catalog = this.occurrenceXml;
		let item = catalog.iterateNext();
		let templates = [];
		while (item) {
			const name = item.getAttribute('name');
			const template = html`
				<fx-table-occurrence .xmlNode=${item} .xmlDocument=${this.xmlDocument}></fx-table-occurrence>
			`;
			templates.push(template);
			item = catalog.iterateNext();
		}

		return templates;
	}

	toggleDetailType(type) {
		this.detailType = this.detailType === type ? '' : type;
	}
		
		
	detailTemplate() {
		switch (this.detailType) {
			case 'fields':
				return html`<h2 class='detail-title'><a href='/field?tableId=${this.id}' @click=${route}>Fields</a></h2><div class='element-detail'>${this.fieldsTemplate()}</div>`;
			case 'occurrences':
				return html`<h2 class='detail-title'>Occurrences</h2><div class='element-detail'>${this.occurrencesTemplate()}</div>`;
			default:
				return nothing;
		}
	}

	xpath(path, resultType) {
		return this.xmlDocument.evaluate(path, this.xmlDocument, null, resultType, null);
	
	}

}

customElements.define('fx-base-table', FxBaseTable);