/*
	@version: 1.3.0
	@author: 	howeller, eric@howellstudio.com
	@desc: 		Helpful Gulp file system utilities
	@usage: 	
		let doesMyFileExist = util.fileCheck('./myFolder/myFile.js'); // true / false

		let mySrcFolders = util.getFolders(./myFolder/); // Array of folder paths

		let myImages = util.mkDirByPathSync('./myFolder/myImages/'); 
*/

const fs=require('fs'),
	path = require('path');

module.exports = { fileCheck, fsExistsSync, getFolders, isDirEmpty, mkDirByPathSync, propCheck, checkBackupSuffix };

/*
	Check to see if a property exists in json object
*/
function propCheck(obj, prop){
	// console.log('propCheck : '+obj._name+' ? '+obj[prop]);
	return (obj[prop]) ? true:false;
}

/*
	Check to see if a file exists
*/
function fileCheck (_path){
	// console.log(`?	fileCheck ${_path}`);
	try {
		if (fs.existsSync(_path)) {
			return true;
		}
	} catch(err) {
		//console.error(err)
		return false;
	}
}
/*
	Check to see if a directory exists
*/
function fsExistsSync(dir) {
	try {
		fs.accessSync(dir);
		return true;
	} catch (e) {
		return false;
	}
}

/*
	Check to see if a directory is empty
*/
function isDirEmpty(dir) {
	if(fsExistsSync(dir)){
		return fs.readdirSync(dir).length === 0;
	}
	return true;
}

/*
	Returns a list sub directories (individual banner/email folders)
*/
function getFolders(dir) {
	return fs.readdirSync(dir).filter(function(file) {
		return fs.statSync(path.join(dir, file)).isDirectory();
	});
}

/*
	Checks to see if a directory exists and creates it if not.
*/
function mkDirByPathSync(targetDir, { isRelativeToScript = false } = {}) {
	const sep = path.sep;
	const initDir = path.isAbsolute(targetDir) ? sep : '';
	const baseDir = isRelativeToScript ? __dirname : '.';

	return targetDir.split(sep).reduce((parentDir, childDir) => {
		const curDir = path.resolve(baseDir, parentDir, childDir);
		try {
			fs.mkdirSync(curDir);
		} catch (err) {
			if (err.code === 'EEXIST') { 
				// curDir already exists!
				return curDir;
			}
			// To avoid `EISDIR` error on Mac and `EACCES`-->`ENOENT` and `EPERM` on Windows.
			if (err.code === 'ENOENT') { 
				// Throw the original parentDir error on curDir `ENOENT` failure.
				throw new Error(`EACCES: permission denied, mkdir '${parentDir}'`);
			}
			const caughtErr = ['EACCES', 'EPERM', 'EISDIR'].indexOf(err.code) > -1;
			if (!caughtErr || caughtErr && curDir === path.resolve(targetDir)) {
				// Throw if it's just the last created dir.
				throw err; 
			}
		}
		return curDir;
	}, initDir);
}

/*
	Checks to see backup file has the correct suffix "-backup". Used with gulp-rename plugin.
*/
function checkBackupSuffix(path) {
	let _suffix = '-backup',
		_name = path.basename.toString(),
		_fileSuffix = _name.substr(_name.length - _suffix.length);

		path.basename = _suffix === _fileSuffix ? path.basename : path.basename + _suffix;
		console.log(path.basename);

		return path;
}