export const getRelationshipName = (relationship) => { 
	// name like leftTable::rightTable
	const leftTableName = relationship.querySelector('LeftTable > TableOccurrenceReference').
		getAttribute('name');
	const rightTableName = relationship.querySelector('RightTable > TableOccurrenceReference').
		getAttribute('name');
	return `${leftTableName}::${rightTableName}`;
};