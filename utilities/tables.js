import { html } from 'https://cdn.skypack.dev/lit-element';
import { xpath } from '../utilities/xpath.js';

const refColWidth = '20px';
const modCountWidth = '6ch';
const uuidAccountNameWidth = '10%';
const timestampWidth = '10%';

// General
export function renderUuidTds(uuidNode) {
	return html`
			<td>${uuidNode.getAttribute('modifications')}</td>
			<td>${uuidNode.getAttribute('accountName')}</td>
			<td>${new Date(uuidNode.getAttribute('timestamp')).toLocaleString()}</td>
		`;
}

// Fields
function fieldsColumnsTemplate() {
	return html`
				<tr>
					<th></th>
					<th>Name</th>
					<th>Type</th>
					<th>Data</th>
					<th>Mod</th>
					<th>Account</th>
					<th>Timestamp</th>
				</tr>
			`;
}

function fieldsColumnGroupTemplate() {
	return html`
				<colgroup>
					<col style='width: ${refColWidth}'></col>
					<col style='width: auto'></col>
					<col style='width: 6ch'></col>
					<col style='width: 10ch'></col>
					<col style='width: ${modCountWidth}'></col>
					<col style='width: ${uuidAccountNameWidth}'></col>
					<col style='width: ${timestampWidth}'></col>
				</colgroup>
			`;
}

function fieldsRowTemplate(field) {
	const uuidNode = field.querySelector('UUID');
	const uuid = uuidNode.textContent;
	const name = field.getAttribute('name');
	const comment = field.getAttribute('comment');
	const type = field.getAttribute('fieldtype');
	const dataType = field.getAttribute('datatype');
	return html`
				<tr title=${comment}>
					<td>
						<fx-references-button .xmlNode=${field}>R</fx-references-button>
					</td>
					<td><fx-a href=${`/detail?uuid=${uuid}`}>${field.getAttribute('name')}</fx-a></td>
					<td>${type}</td>
					<td>${dataType}</td>
					${renderUuidTds(uuidNode)}
				</tr>
			`;
}

export function fieldsTable(data) {
	return html`
				<fx-data-table
					.data=${data}
					.columnsTemplate=${fieldsColumnsTemplate}
					.rowTemplate=${fieldsRowTemplate}
					.columnGroupTemplate=${fieldsColumnGroupTemplate}>
				</fx-data-table>
			`;
}

// Base Tables
function baseTableColumnsTemplate() {
	return html`
				<tr>
					<th></th>
					<th>Name</th>
					<th>Fields</th>
					<th>Mod</th>
					<th>Account</th>
					<th>Timestamp</th>
				</tr>
			`;
}

function baseTableColumnGroupTemplate() { 
	return html`
				<colgroup>
					<col style='width: ${refColWidth}'></col>
					<col style='width: auto'></col>
					<col style='width: ${modCountWidth}'></col>
					<col style='width: ${modCountWidth}'></col>
					<col style='width: ${uuidAccountNameWidth}'></col>
					<col style='width: ${timestampWidth}'></col>
				</colgroup>
			`;

}

function baseTableRowTemplate(baseTable) { 
	const uuidNode = baseTable.querySelector('UUID');
	const uuid = uuidNode.textContent;
	const document = baseTable.ownerDocument;

	// get the field count
	const fieldCount = xpath(`//FieldsForTables//BaseTableReference[@id="${baseTable.getAttribute('id')}"]/following-sibling::ObjectList/@membercount`, XPathResult.NUMBER_TYPE, document).numberValue;

	return html`
				<tr>
					<td>
						<fx-references-button .xmlNode=${baseTable}>R</fx-references-button>
					</td>
					<td><fx-a href=${`/detail?uuid=${uuid}`}>${baseTable.getAttribute('name')}</fx-a></td>
					<td>${fieldCount}</td>
					${renderUuidTds(uuidNode)}
				</tr>
			`;
};

export function baseTableTable(data) { 
	return html`
				<fx-data-table
					.data=${data}
					.columnsTemplate=${baseTableColumnsTemplate}
					.rowTemplate=${baseTableRowTemplate}
					.columnGroupTemplate=${baseTableColumnGroupTemplate}>
				</fx-data-table>
			`;

}

// Table Occurrences
function occurrencesColumnsTemplate() {
	return html`
				<tr>
					<th></th>
					<th>Name</th>
					<th>Color</th>
					<th>T/L</th>
					<th>W/H</th>
					<th>Mod</th>
					<th>Account</th>
					<th>Timestamp</th>
				</tr>
			`;
}

function occurrencesColumnGroupTemplate() {
	return html`
		<colgroup>
			<col style='width: ${refColWidth}'></col>
			<col style='width: auto'></col>
			<col style='width: 50px'></col>
			<col style='width: 15ch'></col>
			<col style='width: 15ch'></col>
			<col style='width: ${modCountWidth}'></col>
			<col style='width: ${uuidAccountNameWidth}'></col>
			<col style='width: ${timestampWidth}'></col>
		</colgroup>`
}

function occurrencesRowTemplate(occurrence) {
	const uuidNode = occurrence.querySelector('UUID');
	const coordRect = occurrence.querySelector('CoordRect');
	const width = coordRect.getAttribute('right') - coordRect.getAttribute('left');
	const height = coordRect.getAttribute('bottom') - coordRect.getAttribute('top');
	const uuid = uuidNode.textContent;
	const color = occurrence.querySelector('Color');
	const r = color.getAttribute('red');
	const g = color.getAttribute('green');
	const b = color.getAttribute('blue');
	return html`
				<tr>
					<td>
						<fx-references-button .xmlNode=${occurrence}>R</fx-references-button>
					</td>
					<td><fx-a href=${`/detail?uuid=${uuid}`}>${occurrence.getAttribute('name')}</fx-a></td>
					<td><div style='background-color: rgb(${r},${g},${b}); width: 1rem; height: 1rem; border-radius: 50%;'></div></td>
					<td>[${coordRect.getAttribute('top')}, ${coordRect.getAttribute('left')}]</td>
					<td>${width} x ${height}</td>
					${renderUuidTds(uuidNode)}
				</tr>
			`;
}

export function occurrencesTable(data) {
	return html`
				<fx-data-table
					.data=${data}
					.columnsTemplate=${occurrencesColumnsTemplate}
					.rowTemplate=${occurrencesRowTemplate}
					.columnGroupTemplate=${occurrencesColumnGroupTemplate}>
				</fx-data-table>
			`;
}

// External Data Sources
function externalDataSourcesColumnsTemplate() {
	return html`
				<tr>
					<th></th>
					<th>Name</th>
					<th>Mod</th>
					<th>Account</th>
					<th>Timestamp</th>
				</tr>
			`;
}

function externalDataSourcesColumnGroupTemplate() {
	return html`
				<colgroup>
					<col style='width: ${refColWidth}'></col>
					<col style='width: auto'></col>
					<col style='width: ${modCountWidth}'></col>
					<col style='width: ${uuidAccountNameWidth}'></col>
					<col style='width: ${timestampWidth}'></col>
				</colgroup>
			`;
}

function externalDataSourcesRowTemplate(dataSource) {
	const uuidNode = dataSource.querySelector('UUID');
	const uuid = uuidNode.textContent;
	return html`
				<tr>
					<td>
						<fx-references-button .xmlNode=${dataSource}>R</fx-references-button>
					</td>
					<td><fx-a href=${`/detail?uuid=${uuid}`}>${dataSource.getAttribute('name')}</fx-a></td>
					${renderUuidTds(uuidNode)}
				</tr>
			`;
}

export function externalDataSourcesTable(data) {
	return html`
				<fx-data-table
					.data=${data}
					.columnsTemplate=${externalDataSourcesColumnsTemplate}
					.rowTemplate=${externalDataSourcesRowTemplate}
					.columnGroupTemplate=${externalDataSourcesColumnGroupTemplate}>
				</fx-data-table>
			`;
}

// Custom Functions
function customFunctionsColumnsTemplate() {
	return html`
				<tr>
					<th></th>
					<th>Name</th>
					<th>Mod</th>
					<th>Account</th>
					<th>Timestamp</th>
				</tr>
			`;
}

function customFunctionsColumnGroupTemplate() {
	return html`
				<colgroup>
					<col style='width: ${refColWidth}'></col>
					<col style='width: auto'></col>
					<col style='width: ${modCountWidth}'></col>
					<col style='width: ${uuidAccountNameWidth}'></col>
					<col style='width: ${timestampWidth}'></col>
				</colgroup>
			`;
}

function customFunctionsRowTemplate(customFunction) {
	const uuidNode = customFunction.querySelector('UUID');
	const uuid = uuidNode.textContent;
	return html`
				<tr>
					<td>
						<fx-references-button .xmlNode=${customFunction}>R</fx-references-button>
					</td>
					<td><fx-a href=${`/detail?uuid=${uuid}`}>${customFunction.getAttribute('name')}</fx-a></td>
					${renderUuidTds(uuidNode)}
				</tr>
			`;
}

export function customFunctionsTable(data) {
	return html`
				<fx-data-table
					.data=${data}
					.columnsTemplate=${customFunctionsColumnsTemplate}
					.rowTemplate=${customFunctionsRowTemplate}
					.columnGroupTemplate=${customFunctionsColumnGroupTemplate}>
				</fx-data-table>
			`;
}

// Value Lists
function valueListColumnsTemplate() {
	return html`
				<tr>
					<th></th>
					<th>Name</th>
					<th>Mod</th>
					<th>Account</th>
					<th>Timestamp</th>
				</tr>
			`;
}

function valueListColumnGroupTemplate() {
	return html`
				<colgroup>
					<col style='width: ${refColWidth}'></col>
					<col style='width: auto'></col>
					<col style='width: ${modCountWidth}'></col>
					<col style='width: ${uuidAccountNameWidth}'></col>
					<col style='width: ${timestampWidth}'></col>
				</colgroup>
			`;
}

function valueListRowTemplate(valueList) {
	const uuidNode = valueList.querySelector('UUID');
	const uuid = uuidNode.textContent;
	return html`
				<tr>
					<td>
						<fx-references-button .xmlNode=${valueList}>R</fx-references-button>
					</td>
					<td><fx-a href=${`/detail?uuid=${uuid}`}>${valueList.getAttribute('name')}</fx-a></td>
					${renderUuidTds(uuidNode)}
				</tr>
			`;
}

export function valueListTable(data) {
	return html`
				<fx-data-table
					.data=${data}
					.columnsTemplate=${valueListColumnsTemplate}
					.rowTemplate=${valueListRowTemplate}
					.columnGroupTemplate=${valueListColumnGroupTemplate}>
				</fx-data-table>
			`;
}
