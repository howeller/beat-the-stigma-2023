/*
	@version: 0.0.0
	@author: 	howeller, eric@howellstudio.com
	@desc: 		Helpful utilities for automating preview site config builds
	@usage: 	
*/

const fs=require('fs'),
			path = require('path'),
			sizeOf = require('image-size');

exports.getImgFiles = getImgFiles;

/*
	Return array of img objects with name, extension, width & height properties
*/
function getImgFiles(dirname) {
	let _list = [];

	fs.readdirSync(dirname).forEach(file => {
		let fileType = path.extname(file).substring(1);

		if(fileType === 'jpg'||fileType === 'png'||fileType === 'gif'){

			let dimensions = sizeOf(dirname+'/'+file),
					name = path.parse(file).name,
					is2x = name.endsWith('2x'),
					obj = {};

			obj['name'] = name;
			obj['ext'] = fileType;
			obj['width'] = is2x ? dimensions.width/2 : dimensions.width;
			obj['height'] = is2x ? dimensions.height/2 : dimensions.height;

			_list.push(obj);
		}
	});
	return _list;
}
