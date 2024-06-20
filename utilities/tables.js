// LitElement
import { html, nothing } from 'https://cdn.skypack.dev/lit-element';

// utilities
import { xpath } from '../utilities/xpath.js';

// components
import '../components/FxReferencesButton.js';
import '../components/FxDataTable.js';
import '../components/FxAnchor.js';
import '../components/FxNavButton.js';


const refColWidth = '20px';
const modCountWidth = '8ch';
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
					<th>Id</th>
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
					<col style='width: ${modCountWidth}'></col>
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
					<td><fx-a href=${`/detail?uuid=${uuid}`}>${name}</fx-a></td>
					<td><fx-a href=${`/detail?uuid=${uuid}`}>${field.id}</fx-a></td>
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
					<th>Id</th>
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
	// const fieldCount = xpath(`//FieldsForTables//BaseTableReference[@id="${baseTable.getAttribute('id')}"]/following-sibling::ObjectList/@membercount`, XPathResult.NUMBER_TYPE, document).numberValue;
	const fieldCount = document.querySelector(`FieldsForTables > FieldCatalog > BaseTableReference[UUID="${uuid}"] + ObjectList`)?.getAttribute('membercount')

	return html`
				<tr>
					<td>
						<fx-references-button .xmlNode=${baseTable}>R</fx-references-button>
					</td>
					<td><fx-a href=${`/detail?uuid=${uuid}`}>${baseTable.getAttribute('name')}</fx-a></td>
					<td><fx-a href=${`/detail?uuid=${uuid}`}>${baseTable.id}</fx-a></td>
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
					<th>Table</th>
					<th>Id</th>
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
			<col style='width: 15%'></col>
			<col style='width: 10ch'></col>
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
	const table = occurrence.querySelector('BaseTableReference').getAttribute('name');
	const tableUuid = occurrence.querySelector('BaseTableReference').getAttribute('UUID');
	return html`
				<tr>
					<td>
						<fx-references-button .xmlNode=${occurrence}>R</fx-references-button>
					</td>
					<td><fx-a href=${`/detail?uuid=${uuid}`}>${occurrence.getAttribute('name')}</fx-a></td>
					<td><fx-a href=${`/detail?uuid=${tableUuid}`}>${table}</fx-a></td>
					<td><fx-a href=${`/detail?uuid=${uuid}`}>${occurrence.id}</fx-a></td>
					<td><div style='background-color: rgb(${r},${g},${b}); width: 1rem; height: 1rem; border-radius: 50%;'></div></td>
					<td>[${coordRect.getAttribute('top')}, ${coordRect.getAttribute('left')}]</td>
					<td>${width} x ${height}</td>
					${renderUuidTds(uuidNode)}
				</tr>
			`;
}

export function tableOccurrenceTable(data) {
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
					<th>Id</th>
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
					<td><fx-a href=${`/detail?uuid=${uuid}`}>${dataSource.id}</fx-a></td>
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
					<td><fx-a href=${`/detail?uuid=${uuid}`}>${customFunction.id}</fx-a></td>
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
					<th>Id</th>
					<th>Type</th>
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
					<col style='width: 20ch'></col>
					<col style='width: ${modCountWidth}'></col>
					<col style='width: ${uuidAccountNameWidth}'></col>
					<col style='width: ${timestampWidth}'></col>
				</colgroup>
			`;
}

function valueListRowTemplate(valueList) {
	const uuidNode = valueList.querySelector('UUID');
	const uuid = uuidNode.textContent;
	const type = valueList.querySelector('Source').getAttribute('value');
	return html`
				<tr>
					<td>
						<fx-references-button .xmlNode=${valueList}>R</fx-references-button>
					</td>
					<td><fx-a href=${`/detail?uuid=${uuid}`}>${valueList.getAttribute('name')}</fx-a></td>
					<td><fx-a href=${`/detail?uuid=${uuid}`}>${valueList.id}</fx-a></td>
					<td><fx-a href=${`/detail?uuid=${uuid}`}>${type}</fx-a></td>
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


// Base Directory
function baseDirectoryColumnsTemplate() {
	return html`
				<tr>
					<th></th>
					<th>Name</th>
					<th>Id</th>
					<th>Mod</th>
					<th>Account</th>
					<th>Timestamp</th>
				</tr>
			`;
}

function baseDirectoryColumnGroupTemplate() {
	return html`
				<colgroup>
					<col style='width: ${refColWidth}'></col>
					<col style='width: auto'></col>
					<col style='width: 6ch'></col>
					<col style='width: ${modCountWidth}'></col>
					<col style='width: ${uuidAccountNameWidth}'></col>
					<col style='width: ${timestampWidth}'></col>
				</colgroup>
			`;
}

function baseDirectoryRowTemplate(baseDirectory) {
	const uuidNode = baseDirectory.querySelector('UUID');
	const uuid = uuidNode.textContent;
	return html`
				<tr>
					<td>
						<fx-references-button .xmlNode=${baseDirectory}>R</fx-references-button>
					</td>
					<td><fx-a href=${`/detail?uuid=${uuid}`}>${baseDirectory.getAttribute('name')}</fx-a></td>
					<td><fx-a href=${`/detail?uuid=${uuid}`}>${baseDirectory.id}</fx-a></td>
					${renderUuidTds(uuidNode)}
				</tr>
			`;
}

export function baseDirectoryTable(data) {
	return html`
				<fx-data-table
					.data=${data}
					.columnsTemplate=${baseDirectoryColumnsTemplate}
					.rowTemplate=${baseDirectoryRowTemplate}
					.columnGroupTemplate=${baseDirectoryColumnGroupTemplate}>
				</fx-data-table>
			`;
}

// File Access
function fileAccessColumnsTemplate() {
	return html`
				<tr>
					<th></th>
					<th>Name</th>
					<th>Id</th>
					<th>Type</th>
					<th>Added</th>
					<th>By</th>
					<th>Mod</th>
					<th>Account</th>
					<th>Timestamp</th>
				</tr>
			`;
}

function fileAccessColumnGroupTemplate() {
	return html`
				<colgroup>
					<col style='width: ${refColWidth}'></col>
					<col style='width: auto'></col>
					<col style='width: ${modCountWidth}'></col>
					<col style='width: 10ch'></col>
					<col style='width: ${timestampWidth}'></col>
					<col style='width: ${uuidAccountNameWidth}'></col>
					<col style='width: ${modCountWidth}'></col>
					<col style='width: ${uuidAccountNameWidth}'></col>
					<col style='width: ${timestampWidth}'></col>
				</colgroup>
			`;
}

function fileAccessRowTemplate(access) {
	const id = access.getAttribute('id');
	const type = access.getAttribute('type');
	const uuid = access.querySelector('UUID').textContent;
	const source = access.querySelector('Source');
	const addedAt = source.getAttribute('CreationTimestamp');
	return html`
				<tr>
					<td>
						<fx-references-button .xmlNode=${access}>R</fx-references-button>
					</td>
					<td><fx-a href="/detail?uuid=${uuid}">${access.querySelector('Display').textContent}</fx-a></td>
					<td><fx-a href="/detail?uuid=${uuid}">${id}</fx-a></td>
					<td><fx-a href="/detail?uuid=${uuid}">${type}</fx-a></td>
					<td>${new Date(addedAt).toLocaleString()}</td>
					<td>${source.getAttribute('CreationAccountName')}</td>
					${renderUuidTds(access.querySelector('UUID'))}
				</tr>
			`;
}

export function fileAccessTable(data) {
	return html`
				<fx-data-table
					.data=${data}
					.columnsTemplate=${fileAccessColumnsTemplate}
					.rowTemplate=${fileAccessRowTemplate}
					.columnGroupTemplate=${fileAccessColumnGroupTemplate}>
				</fx-data-table>
			`;
}

// Relationship
function relationshipColumnsTemplate() {
	return html`
				<tr>
					<th></th>
					<th>Left Table Occurrence</th>
					<th>Right Table Occurrence</th>
					<th>Id</th>
					<th>Predicate Count</th>
					<th>Mod</th>
					<th>Account</th>
					<th>Timestamp</th>
				</tr>
			`;
}

function relationshipColumnGroupTemplate() {
	return html`
				<colgroup>
					<col style='width: ${refColWidth}'></col>
					<col style='width: auto'></col>
					<col style='width: auto'></col>
					<col style='width: ${modCountWidth}'></col>
					<col style='width: ${modCountWidth}'></col>
					<col style='width: ${modCountWidth}'></col>
					<col style='width: ${uuidAccountNameWidth}'></col>
					<col style='width: ${timestampWidth}'></col>
				</colgroup>
			`;
}

function relationshipRowTemplate(relationship) {
	const uuidNode = relationship.querySelector('UUID');
	const uuid = uuidNode.textContent;
	const leftTable = relationship.querySelector('LeftTable > TableOccurrenceReference').getAttribute('name');
	const leftUuid = relationship.querySelector('LeftTable > TableOccurrenceReference').getAttribute('UUID');
	const rightTable = relationship.querySelector('RightTable > TableOccurrenceReference').getAttribute('name');
	const rightUuid = relationship.querySelector('RightTable > TableOccurrenceReference').getAttribute('UUID');
	const predicateCount = relationship.querySelector(':scope > JoinPredicateList')?.getAttribute('membercount') || 0;

	return html`
				<tr>
					<td>
						<fx-references-button .xmlNode=${relationship}>R</fx-references-button>
					</td>
					<td><fx-a href=${`/detail?uuid=${leftUuid}`}>${leftTable}</fx-a></td>
					<td><fx-a href=${`/detail?uuid=${rightUuid}`}>${rightTable}</fx-a></td>
					<td><fx-a href=${`/detail?uuid=${uuid}`}>${relationship.id}</fx-a></td>
					<td><fx-a href=${`/detail?uuid=${uuid}`}>${predicateCount}</fx-a></td>
					${renderUuidTds(uuidNode)}
				</tr>
			`;
}

export function relationshipTable(data) {
	return html`
				<fx-data-table
					.data=${data}
					.columnsTemplate=${relationshipColumnsTemplate}
					.rowTemplate=${relationshipRowTemplate}
					.columnGroupTemplate=${relationshipColumnGroupTemplate}>
				</fx-data-table>
			`;
}

// Catalog
function catalogColumnsTemplate() {
	return html`
				<tr>
					<th></th>
					<th>Name</th>
					<th>Items</th>
					<th>Mod</th>
					<th>Account</th>
					<th>Timestamp</th>
				</tr>
			`;
}

function catalogColumnGroupTemplate() {
	return html`
				<colgroup>
					<col style='width: ${refColWidth}'></col>
					<col style='width: auto'></col>
					<col style='width: 6ch'></col>
					<col style='width: ${modCountWidth}'></col>
					<col style='width: ${uuidAccountNameWidth}'></col>
					<col style='width: ${timestampWidth}'></col>
				</colgroup>
			`;
}

function catalogRowTemplate(catalog) {

	// the library catalog won't have a UUID
	const uuidNode = catalog.querySelector('UUID');

	const uuid = uuidNode?.textContent;
	const name = catalog.nodeName;
	const nameKebabCase = name.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`).slice(1);
	const nameProper = name.replace(/([A-Z])/g, (g) => ` ${g[0]}`).slice(1);
	const nameClean = nameKebabCase.replace('-catalog', '');
	const memberCount = catalog.getAttribute('membercount');


	return html`
				<tr>
					<td>
						${uuidNode ? html`
							<fx-references-button .xmlNode=${catalog}>R</fx-references-button>
						` : ''}
					</td>
					<td><fx-a href=${`/${nameClean}`}>${nameProper}</fx-a></td>
					<td>${memberCount}</td>
					${uuidNode ? renderUuidTds(uuidNode) : ''}
				</tr>
			`;
}

export function catalogTable(data) {
	return html`
				<fx-data-table
					.data=${data}
					.columnsTemplate=${catalogColumnsTemplate}
					.rowTemplate=${catalogRowTemplate}
					.columnGroupTemplate=${catalogColumnGroupTemplate}>
				</fx-data-table>
			`;
}

// Custom Menu
function customMenuColumnsTemplate() {
	return html`
				<tr>
					<th></th>
					<th>Name</th>
					<th>Id</th>
					<th>Items</th>
					<th>Mod</th>
					<th>Account</th>
					<th>Timestamp</th>
				</tr>
			`;
}

function customMenuColumnGroupTemplate() {
	return html`
				<colgroup>
					<col style='width: ${refColWidth}'></col>
					<col style='width: auto'></col>
					<col style='width: 6ch'></col>
					<col style='width: 6ch'></col>
					<col style='width: ${modCountWidth}'></col>
					<col style='width: ${uuidAccountNameWidth}'></col>
					<col style='width: ${timestampWidth}'></col>
				</colgroup>
			`;
}

function customMenuRowTemplate(menu) {
	const uuidNode = menu.querySelector('UUID');
	const uuid = uuidNode.textContent;
	const name = menu.getAttribute('name');
	const memberCount = menu.querySelector('MenuItemList').getAttribute('membercount');
	return html`
				<tr>
					<td>
						<fx-references-button .xmlNode=${menu}>R</fx-references-button>
					</td>
					<td><fx-a href=${`/detail?uuid=${uuid}`}>${name}</fx-a></td>
					<td><fx-a href=${`/detail?uuid=${uuid}`}>${menu.id}</fx-a></td>
					<td>${memberCount}</td>
					${renderUuidTds(uuidNode)}
				</tr>
			`;
}

export function customMenuTable(data) {
	return html`
				<fx-data-table
					.data=${data}
					.columnsTemplate=${customMenuColumnsTemplate}
					.rowTemplate=${customMenuRowTemplate}
					.columnGroupTemplate=${customMenuColumnGroupTemplate}>
				</fx-data-table>
			`;
}

// Script
function scriptColumnsTemplate() {
	return html`
				<tr>
					<th></th>
					<th>Name</th>
					<th>Id</th>
					<th>Type</th>
					<th>Full Access</th>
					<th>Mod</th>
					<th>Account</th>
					<th>Timestamp</th>
				</tr>
			`;
}

function scriptColumnGroupTemplate() {
	return html`
				<colgroup>
					<col style='width: 55px'></col>
					<col style='width: auto'></col>
					<col style='width: 6ch'></col>
					<col style='width: 10ch'></col>
					<col style='width: 6ch'></col>
					<col style='width: ${modCountWidth}'></col>
					<col style='width: ${uuidAccountNameWidth}'></col>
					<col style='width: ${timestampWidth}'></col>
				</colgroup>
			`;
}

function scriptRowTemplate(script) {
	const uuidNode = script.querySelector('UUID');
	const uuid = uuidNode.textContent;
	const name = script.getAttribute('name');
	const isFolder = script.getAttribute('isFolder') == "True" ? true : false;
	const isMarker = script.getAttribute('isFolder') == "marker" ? true : false;
	const type = isFolder ? 'Folder' : isMarker ? 'Marker' : 'Script';
	const fullAccess = script.querySelector('Options').getAttribute('runwithfullaccess') == "True" ? 'Yes' : 'No';


	return html`
				<tr>
					<td>
						<fx-references-button .xmlNode=${script}>R</fx-references-button>
						<fx-nav-button href='call-chain?uuid=${uuid}'>CC</fx-nav-button>
					</td>
					<td><fx-a href=${`/script-step?scriptId=${script.id}`}>${name}</fx-a></td>
					<td><fx-a href=${`/script-step?scriptId=${script.id}`}>${script.id}</fx-a></td>
					<td>${type}</td>
					<td>${fullAccess}</td>
					${renderUuidTds(uuidNode)}
				</tr>
			`;
}

export function scriptTable(data) {
	return html`
				<fx-data-table
					.data=${data}
					.columnsTemplate=${scriptColumnsTemplate}
					.rowTemplate=${scriptRowTemplate}
					.columnGroupTemplate=${scriptColumnGroupTemplate}>
				</fx-data-table>
			`;
}

// Accounts
function accountsColumnsTemplate() {
	return html`
				<tr>
					<th></th>
					<th>Name</th>
					<th>Id</th>
					<th>Privilege Set</th>
					<th>Type</th>
					<th>Enable</th>
					<th>Mod</th>
					<th>Account</th>
					<th>Timestamp</th>
				</tr>
			`;
}

function accountsColumnGroupTemplate() {
	return html`
				<colgroup>
					<col style='width: ${refColWidth}'></col>
					<col style='width: auto'></col>
					<col style='width: 6ch'></col>
					<col style='width: 10%'></col>
					<col style='width: 13ch'></col>
					<col style='width: 6ch'></col>
					<col style='width: ${modCountWidth}'></col>
					<col style='width: ${uuidAccountNameWidth}'></col>
					<col style='width: ${timestampWidth}'></col>
				</colgroup>
			`;

}

function accountsRowTemplate(account) {
	const uuidNode = account.querySelector('UUID');
	const uuid = uuidNode.textContent;
	const name = account.querySelector('AccountName > INSECURE_TEXT').textContent;
	const type = account.getAttribute('type');
	const enable = account.getAttribute('enable') == 'True' ? 'Yes' : 'No';
	const privilegeSet = account.querySelector('PrivilegeSetReference').getAttribute('name');
	return html`
				<tr>
					<td>
						<fx-references-button .xmlNode=${account}>R</fx-references-button>
					</td>
					<td><fx-a href=${`/detail?uuid=${uuid}`}>${name}</fx-a></td>
					<td><fx-a href=${`/detail?uuid=${uuid}`}>${account.id}</fx-a></td>
					<td>${privilegeSet}</td>
					<td>${type}</td>
					<td>${enable}</td>
					${renderUuidTds(uuidNode)}
				</tr>
			`;

}

export function accountsTable(data) {
	return html`
				<fx-data-table
					.data=${data}
					.columnsTemplate=${accountsColumnsTemplate}
					.rowTemplate=${accountsRowTemplate}
					.columnGroupTemplate=${accountsColumnGroupTemplate}>
				</fx-data-table>
			`;

}


// Default
function defaultColumnsTemplate() {
	return html`
				<tr>
					<th></th>
					<th>Name</th>
					<th>Id</th>
					<th>Mod</th>
					<th>Account</th>
					<th>Timestamp</th>
				</tr>
			`;
}

function defaultColumnGroupTemplate() {
	return html`
				<colgroup>
					<col style='width: ${refColWidth}'></col>
					<col style='width: auto'></col>
					<col style='width: 6ch'></col>
					<col style='width: ${modCountWidth}'></col>
					<col style='width: ${uuidAccountNameWidth}'></col>
					<col style='width: ${timestampWidth}'></col>
				</colgroup>
			`;
}

function defaultRowTemplate(item) {
	const uuidNode = item.querySelector(':scope > UUID');
	const uuid = uuidNode?.textContent;
	return html`
				<tr>
					<td>
						<fx-references-button .xmlNode=${item}>R</fx-references-button>
					</td>
					<td><fx-a href=${`/detail?uuid=${uuid}`}>${item.getAttribute('name')}</fx-a></td>
					<td><fx-a href=${`/detail?uuid=${uuid}`}>${item.id}</fx-a></td>
					${uuidNode ? renderUuidTds(uuidNode) : ''}
				</tr>
			`;
}

export function defaultTable(data) {
	return html`
				<fx-data-table
					.data=${data}
					.columnsTemplate=${defaultColumnsTemplate}
					.rowTemplate=${defaultRowTemplate}
					.columnGroupTemplate=${defaultColumnGroupTemplate}>
				</fx-data-table>
			`;
}


// Join Predicates
function joinPredicateColumnsTemplate() {
	return html`
				<tr>
					<th>Left Table</th>
					<th>Left Field</th>
					<th>Operator</th>
					<th>Right Table</th>
					<th>Right Field</th>
				</tr>
			`;
}

function joinPredicateColumnGroupTemplate() {
	return html`
				<colgroup>
					<col style='width: 20%'></col>
					<col style='width: 20%'></col>
					<col style='width: 10%'></col>
					<col style='width: 20%'></col>
					<col style='width: 20%'></col>
				</colgroup>
			`;
}

function joinPredicateRowTemplate(predicate) {
	const leftTable = predicate.querySelector('LeftField TableOccurrenceReference');
	const leftTableUuid = leftTable.getAttribute('UUID');
	const leftField = predicate.querySelector('LeftField FieldReference');
	const leftFieldUuid = leftField.getAttribute('UUID');
	const type = predicate.getAttribute('type');
	const operator = type === 'Equal' ? '=' : type === 'LessOrEqual' ? '<=' : type === 'GreaterOrEqual' ? '>=' : type === 'NotEqual' ? '!=' : type === 'Less' ? '<' : type === 'CartesianProduct' ? 'x' : type === 'Greater' ? '>' : '';
	const rightTable = predicate.querySelector('RightField TableOccurrenceReference');
	const rightTableUuid = rightTable.getAttribute('UUID');
	const rightField = predicate.querySelector('RightField FieldReference');
	const rightFieldUuid = rightField.getAttribute('UUID');

	return html`
				<tr>
					<td><fx-a href=${`/detail?uuid=${leftTableUuid}`}>${leftTable.getAttribute('name')}</fx-a></td>
					<td><fx-a href=${`/detail?uuid=${leftFieldUuid}`}>${leftField.getAttribute('name')}</fx-a></td>
					<td>${operator}</td>
					<td><fx-a href=${`/detail?uuid=${rightTableUuid}`}>${rightTable.getAttribute('name')}</fx-a></td>
					<td><fx-a href=${`/detail?uuid=${rightFieldUuid}`}>${rightField.getAttribute('name')}</fx-a></td>
				</tr>
			`;
}

export function joinPredicateTable(data) {
	return html`
				<fx-data-table
					.data=${data}
					.columnsTemplate=${joinPredicateColumnsTemplate}
					.rowTemplate=${joinPredicateRowTemplate}
					.columnGroupTemplate=${joinPredicateColumnGroupTemplate}>
				</fx-data-table>
			`;
}

// Layout
function layoutColumnsTemplate() {
	return html`
				<tr>
					<th></th>
					<th>Name</th>
					<th>Id</th>
					<th>Table</th>
					<th>Theme</th>
					<th>Hidden</th>
					<th>Menu</th>
					<th>Width</th>
					<th>Mod</th>
					<th>Account</th>
					<th>Timestamp</th>
				</tr>
			`;
}

function layoutColumnGroupTemplate() {
	return html`
				<colgroup>
					<col style='width: ${refColWidth}'></col>
					<col style='width: auto'></col>
					<col style='width: 6ch'></col>
					<col style='width: 20ch'></col>
					<col style='width: 20ch'></col>
					<col style='width: 4ch'></col>
					<col style='width: 20ch'></col>
					<col style='width: 10ch'></col>
					<col style='width: ${modCountWidth}'></col>
					<col style='width: ${uuidAccountNameWidth}'></col>
					<col style='width: ${timestampWidth}'></col>
				</colgroup>
			`;
}

function layoutRowTemplate(layout) {
	const uuidNode = layout.querySelector(':scope > UUID');
	const uuid = uuidNode.textContent;
	const table = layout.querySelector(':scope > TableOccurrenceReference');
	const tableUuid = table?.getAttribute('UUID') || '';
	const theme = layout.querySelector(':scope > LayoutThemeReference');
	const themeName = theme?.getAttribute('name') || '';
	const hidden = layout.querySelector(':scope > Options').getAttribute('hidden') == 'True' ? 'Yes' : 'No'
	const menu = layout.querySelector(':scope > MenuSet > CustomMenuSetReference');
	const menuUuid = menu?.getAttribute('UUID') || '';
	const menuName = menu?.getAttribute('name') || '';
	const width = layout.getAttribute('width');
	const isFolder = layout.getAttribute('isFolder') == "True" ? true : false;
	const isMarker = layout.getAttribute('isFolder') == "marker" ? true : false;


	return html`
				<tr>
					<td>
						<fx-references-button .xmlNode=${layout}>R</fx-references-button>
					</td>
					<td><fx-a href=${`/detail?uuid=${uuid}`}>${layout.getAttribute('name') || ''} ${isFolder || isMarker ? `(${isFolder ? 'Folder' : isMarker ? 'Marker' : ''})` : ''}</fx-a></td>
					<td><fx-a href=${`/detail?uuid=${uuid}`}>${layout.id}</fx-a></td>
					<td><fx-a href=${`/detail?uuid=${tableUuid}`}>${table?.getAttribute('name') || 'n/a'}</fx-a></td>
					<td title=${themeName}><fx-a href=${`/detail?uuid=${theme?.getAttribute('UUID') || ''}`}>${themeName}</fx-a></td>
					<td>${hidden}</td>
					<td title=${menuName}>${menuUuid ? html`<fx-a href=${`/detail?uuid=${menuUuid}`}>${menuName}</fx-a>` : menuName}</td>
					<td>${width}px</td>
					${renderUuidTds(uuidNode)}
				</tr>
			`;
}

export function layoutTable(data) {
	return html`
				<fx-data-table
					.data=${data}
					.columnsTemplate=${layoutColumnsTemplate}
					.rowTemplate=${layoutRowTemplate}
					.columnGroupTemplate=${layoutColumnGroupTemplate}>
				</fx-data-table>
			`;
}