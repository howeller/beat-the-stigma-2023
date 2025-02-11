// Node & NPM packages
const del = require('del'),
	fs = require('fs'),
	merge = require('merge-stream'),
	path = require('path'),
	gulp = require('gulp'),
	gulpif = require('gulp-if'),
	gch = require('gulp-compile-handlebars'),
	htmlmin = require('gulp-html-minifier-terser'),
	rename = require('gulp-rename'),
	zip = require('gulp-zip');

// Custom modules & config
const config = require('./src/config.json'),
	helper = require('./lib/hbHelpers'),
	// imgHelper = require('./lib/hbImgHelpers'),
	util = require('./lib/fsUtils');

// Directory structure
const dir = {
	backups:'./src/backups/',
	css:'./src/templates/css/',
	config:'./src/config.json',
	dist:'./build/html/',
	fpo:'./build/fpo/',
	html:'./src/templates/html/',
	images:'./src/shared_images/',
	js:'./src/templates/js/',
	preview:'./preview/categories/english',
	srcBanners:'./src/banners/',
	src:'./src/',
	statics:'./build/statics/',
	templates:'./src/templates/',
	zips:'./build/zips/'
}

const b1 = ['english', 'Message1'],
	b2 = ['english', 'Message2'],
	b3 = ['english', 'Message3'];

const currentGroup = b3,
	isProduction = true;

/*
*	Loop through JSON config 
*/
function build(version, copyImages=false, showFpoNum=''){
	// console.log('build '+version);

	const config = JSON.parse(fs.readFileSync(dir.config));
	const [_language, _concept] = version;
	const groupToLoopThrough = config[_language][_concept];

	let task = Object.entries(groupToLoopThrough).map(function(obj) {
		if( obj[0]==='group') return;
	
		const _name = obj[0],
			_data = obj[1],
			_dist = util.mkDirByPathSync(path.join(dir.dist, _data.name)),
			_src = path.join(`${dir.srcBanners}${_concept}`, _name),
			_sharedImages = dir.images+_data.width+'x'+_data.height;

		_data['global'] = config.global;
		_data['name'] = _data.name ? _data.name : _name; // use "name" property if listed in config.
		_data['group'] = config[_language][_concept].group;
		_data['imgPath'] = _src+'/images/';
		// console.log(_data.imgPath);

		let option = {
			ignorePartials:false,
			batch:[ dir.css, dir.templates+'html', dir.templates+'js', dir.templates+'svg'],
			helpers : {
				bannerCss: function(){ return this.cssToUse ? this.cssToUse : `${this.name}.css` ? `${this.name}.css` : false },
				bannerAnimateJs: function(){ return this.jsToUse ? this.jsToUse : `${this.name}.js`},
				cssToUse	: function(){ return this.cssToUse ? this.cssToUse : `${this.name}.css`; },
				sharedCss: function(){ return `${this.width}x${this.height}.css` },
				getHtml : function(){ return this.html ? this.html : "default.html" },
				getOutlineSvg : function(){ return this.outlineSvg ? this.outlineSvg : "outline_M1_300x250.svg" },
				getHeaderSvg : function(){ return this.headerSvg ? this.headerSvg : "header_M2_300x250.svg" },
				getName : function(arg){ return arg},
				getFpoName: function(){ return `FPO${showFpoNum}.jpg`;},	
				showFpo: function(){ return showFpoNum; },
				isLeader: function(){ return this.width >= 728 },
				isSkyscraper: function(){ return this.height >= 600 },
				isBox: function(){ return this.width == 300 && this.height == 250 },
				letterCount: function(index){ return parseInt(index) + 7 }, // Returns int for line2 of letters
				frameCount: function(index){ return parseInt(index) + 2 }, // Returns int frame# starting at 2
				getLetterClass: function(scope, index){ return scope.group.frame2.hiddenLetters.includes(index) ? 'missing-letters': 'init-letters'; },
				getGroupAltTxt: function (scope, index) { return scope.group.alt[index] },
				if_eq: helper.if_eq,
				int: helper.int,
				times: helper.times
			}
		}

		const minOptions = { collapseWhitespace: true, minifyCSS:true, minifyJS:true, removeComments:true };

		let _html = gulp.src(dir.templates+'html/main.html.hbs')
			.pipe(gch(_data, option))
			// .pipe(gulpif(isProduction, htmlmin(minOptions)))
			.pipe(gulpif(_data.approved, htmlmin(minOptions)))
			.pipe(rename('index.html'))
			.pipe(gulp.dest(_dist));

		if(copyImages){
			let _images = gulp.src([_sharedImages+'/**', `${_src}/images/**`]).pipe(gulp.dest(_dist));

			if(showFpoNum){
				let _fpoDir = util.mkDirByPathSync(path.join(dir.fpo, _data.name));
				let _fpo = gulp.src(`${_src}/fpo/**`).pipe(gulp.dest(_fpoDir));
			}
			return merge(_html, _images);
		}
		return _html;
	});
	let lastStream = task[task.length-1];
	return lastStream;
}

// Copy Backup JPGs to build
function copyBackups(){
	return gulp.src(dir.backups+'*.{png,jpg,gif}')
	.pipe(rename((path) => util.checkBackupSuffix(path))) // 
	.pipe(gulp.dest(dir.dist));
}

// Make Zips
function zipFiles(version){
	const [_language, _concept] = version;
	const groupFolders = util.getFolders(dir.srcBanners+_concept);

	let task = groupFolders.map(function(folder) {
		let _dist = path.join(dir.dist, folder),
				_name = path.basename(folder);
				// _backup = dir.backups+_name+'-backup.jpg';

		let _html = gulp.src(_dist+'/*.html',{base:_dist})
			.pipe(rename(`${_name}.html`))

		let _files = gulp.src([_dist+'/images/**/*',_dist+'/*.js'],{base:_dist});

		// Zip up named HTML and images folder
		// return gulp.src([_dist+'/**/*'/*,_backup*/])
		return merge(_html, _files)
			.pipe(zip(_name+'.zip'))
			.pipe(gulp.dest(dir.zips));
	});
	let lastStream = task[task.length-1];
	return lastStream;
};

function previewCatConfig(){

	let _data = config;

	let option = {
		ignorePartials:false,
		batch:[ dir.templates+'/js'],
		helpers : {
			isStatics : function(){ return !util.isDirEmpty('./build/statics')},
			imgList : function(){ return previewUtil.getImgFiles('./build/statics')}
		}
	}
	return gulp.src(dir.templates+'/js/contentDataSinglePage.js.hbs')
		.pipe(gch(_data, option))
		.pipe(rename('contentData.js'))
		.pipe(gulp.dest(dir.preview));
};

// Gulp Tasks
gulp.task('backups', copyBackups);

// Build tasks
gulp.task('build', () => { return build(currentGroup, false, '') });
gulp.task('b1', () => { return build(b1, false, '') });
gulp.task('b2', () => { return build(b2, false, '') });
gulp.task('b3', () => { return build(b3, false, '') });

gulp.task('bi', () => { return build(currentGroup, true, '') });
gulp.task('bi1', () => { return build(b1, true, '') });
gulp.task('bi2', () => { return build(b2, true, '') });
gulp.task('bi3', () => { return build(b3, true, '') });


gulp.task('all', gulp.series('b1', 'b2', 'b3'));
gulp.task('all:images', gulp.series('bi1', 'bi2', 'bi3', 'backups'));

// Inject FPO JPGs to check alignment
gulp.task('fpo1', () => { return build(currentGroup, true, '1')});
gulp.task('fpo2', () => { return build(currentGroup, true, '2')});
gulp.task('fpo3', () => { return build(currentGroup, true, '3')});
gulp.task('fpo4', () => { return build(currentGroup, true, '4')});
gulp.task('fpo5', () => { return build(currentGroup, true, '5')});

// Clean Tasks
gulp.task('clean', () => { return del([dir.dist+'**/*']); });
gulp.task('clean:backups', () => { return del([dir.dist+'*.{png,jpg,gif}']); });
gulp.task('clean:fpo', () => { return del([dir.fpo+'**']); });
gulp.task('clean:zips', () => { return del([dir.zips+'**']); });
gulp.task('clean:all', gulp.parallel('clean','clean:zips') );

gulp.task('p', previewCatConfig);
gulp.task('default', gulp.series('build'));

// Watching
gulp.task('watch', () => { return gulp.watch([dir.srcBanners+'**/**/*', dir.templates+'**/*', dir.config], gulp.series('default'))});
gulp.task('w1', () => { return gulp.watch([dir.srcBanners+'*/**', dir.templates+'*/**', dir.config], gulp.series('fpo1'))});
gulp.task('w2', () => { return gulp.watch([dir.srcBanners+'*/**', dir.templates+'*/**', dir.config], gulp.series('fpo2'))});
gulp.task('w3', () => { return gulp.watch([dir.srcBanners+'*/**', dir.templates+'*/**', dir.config], gulp.series('fpo3'))});
gulp.task('w4', () => { return gulp.watch([dir.srcBanners+'*/**', dir.templates+'*/**', dir.config], gulp.series('fpo4'))});
gulp.task('w5', () => { return gulp.watch([dir.srcBanners+'*/**', dir.templates+'*/**', dir.config], gulp.series('fpo5'))});

// Zipping
gulp.task('zip1', () => { return zipFiles(b1) });
gulp.task('zip2', () => { return zipFiles(b2) });
gulp.task('zip3', () => { return zipFiles(b3) });
gulp.task('zip', gulp.series('zip1', 'zip2', 'zip3'));
