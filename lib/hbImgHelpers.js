/*
*	@version: 0.1.0
*	@author: 	howeller, eric@howellstudio.com
*	@desc: 		Helpful Handlebars.js functions for getting image info
*/
const	sizeOf = require('image-size'),
	path = require('path');

module.exports = { getImgProps, getImgSize, getImgWidth };

/*
*	Helper that returns image property (width or height)
*	
*	background-size:{{getImgSize 't1.png' 'width'}}px {{getImgSize 't1.png' 'height'}}px;
*/

function getImgSize(imgPath='./images/', filename, prop) {
	let _img = imgPath+filename,// CHANGE imgPATH TO ARRAY THEN TEST IF FILE IS AT CORRECT PATH
		_dimensions = sizeOf(_img);
		_is2x = _isFileNameEndWith2x(filename);

	return _is2x ? Math.ceil(_dimensions[prop]/2) : _dimensions[prop];
}

/*
*	Returns image width
*	
*	<img srcset = "images/t1.png {{getImgWidth 't1.png'}}" >
*/

function getImgWidth(imgPath='images/', filename) {
	let _img = imgPath+filename,
		_is2x = _isFileNameEndWith2x(filename),
		_width = sizeOf(_img).width;
	// console.log(`${filename} ${_is2x}`);
	return _is2x ? Math.ceil(_width/2) : _width;
}

/*
*	Blocker helper that returns image width, height, & extension
*	
*	{{#getImgProps}}{{log this.width this.height}}{{/getImgProps}}
*/

function getImgProps(imgPath='./images/', filename, options) {
	let _img = imgPath+filename,
		_dimensions = sizeOf(_img),
		_is2x = _isFileNameEndWith2x(filename),
		// Check to see if name indicates @2x image.
		obj = {
			'file' : filename,
			'width' : _is2x ? Math.ceil(_dimensions.width/2) : _dimensions.width,
			'height': _is2x ? Math.ceil(_dimensions.height/2) : _dimensions.height,
			'ext' : _dimensions.type
		};
	return options.fn(obj);
}

function _isFileNameEndWith2x(filename) {
	let _baseName = _removeExtension(filename),
	_suffix = _baseName.substr(_baseName.length - 2);
	return _suffix === '2x';
}

function _removeExtension(filename) {
  return filename.substring(0, filename.lastIndexOf('.')) || filename;
}