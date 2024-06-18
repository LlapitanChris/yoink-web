
export const camelCaseFromKebab = (str) => { 
	// first letter must be lowercase
	return str.split('-').reduce((acc, part, index) => {
		if (index === 0) {
			return part.toLowerCase();
		} else {
			return acc + part[0].toUpperCase() + part.slice(1);
		}
	});
};

export const pascalCaseFromKebab = (str) => { 
	// first letter must be uppercase
	return str.split('-').map(part => part[0].toUpperCase() + part.slice(1)).join('');
}

export const kebabToProperName = (str) => { 
	return str.split('-').map(part => part[0].toUpperCase() + part.slice(1)).join(' ');
}