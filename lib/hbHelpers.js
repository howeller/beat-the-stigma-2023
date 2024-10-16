/*
*	@version: 0.1.3
*	@author: 	howeller, eric@howellstudio.com
*	@desc: 		Helpful functions for Handlebars.js
*/

module.exports = { if_eq, ifIsTxtId, int, propCheck, times };

/*
*	Check to see if obj property matches a value
*
*	{{if_eq color red}}{{log 'Show the red!'}}{{/if_eq}}
*/
function if_eq(a, b, options){
	if (a == b) {
		return options.fn(this);
	} else {
		return options.inverse(this);
	}
}

/*
*	Adds 1 to loop index number. 
*
*	{{#each array}}
*		{{int @index}} // 1, 2, 3..
*	{{/each}}
*/
function int (value, options) { 
	return parseInt(value) + 1; 
}

/*
*	Locate file names that begins with a "t" and is followed by numbers. (t1, t11, ect)
*	^[t] means starts with "t" [0-9]{1,2} means next 1 to 2 letters are numeric
*
*	{{#ifIsTxtId name}} {{log name}} {{/ifIsTxtId}}
*/
function ifIsTxtId (string, options) {
	return /^[t][0-9]{1,2}/i.test(string) ? options.fn(this) : options.inverse(this); 
}

/*
*	Check to see if a property exists in json object
*/
function propCheck(obj, prop){
	// console.log('propCheck : '+obj._name+' ? '+obj[prop]);
	return (obj[prop]) ? true:false;
}

/*
*	Create a for loop based on number value
*
*	{{#times 10}}
*		<span> {{@first}} {{@index}} {{@last}}</span>
*	{{/times}}
*/
function times(num, block) {
	let accum = '';
	for(let i = 0; i < num; ++i) {
		block.data.index = i;
		block.data.first = i === 0;
		block.data.last = i === (num - 1);
		accum += block.fn(this);
	}
	return accum;
}
