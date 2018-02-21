/*--------------------------------------------------------------------------
	load modules
--------------------------------------------------------------------------*/
const $ = {
	browserSync  : require("browser-sync"),
	gulp         : require("gulp"),
	plugins      : require("gulp-load-plugins")(),
	browserify   : require("browserify"),
	buffer       : require("vinyl-buffer"),
	source       : require("vinyl-source-stream")
}


/*--------------------------------------------------------------------------
	config
--------------------------------------------------------------------------*/
// フォルダパス設定
const PATH = {
	develop: "develop/", // 開発用ディレクトリ
	htdocs : "htdocs/"   // 公開用ディレクトリ
};

// 対象外ファイル
const EXCLUDED = [
	"!" + PATH.develop + "**/*コピー*.*",
	"!" + PATH.develop + "**/_*.*"
];

// リリースモード判定フラグ
const IS_REL = (()=>{
	let _arg = process.argv.slice(1)[1];
	return _arg && _arg.indexOf("-rel") !== -1;
})();


/*--------------------------------------------------------------------------
	default
--------------------------------------------------------------------------*/
$.gulp.task("default", [
	// "shader",
	"sass",
	"js",
	"browserSync",
	"watch"
]);


/*--------------------------------------------------------------------------
	watch
--------------------------------------------------------------------------*/
$.gulp.task("watch", ()=>{
	// browserSync
	$.gulp.watch([
		PATH.htdocs + "**/*.html",
		PATH.htdocs + "assets/css/**/*.css"
	])
	.on("change", (file)=>{
		$.browserSync.reload();
	});

	// sass
	$.gulp.watch([PATH.develop + "assets/css/**/*.scss"], ["sass"]);

	// js
	$.gulp.watch([PATH.develop + "assets/js/**/*.js"], ["js"]);

	// shader
	// $.gulp.watch([PATH.develop + "assets/shader/**/*.{vert,frag,glsl}"], ["shader"]);
});


/*--------------------------------------------------------------------------
	browserSync
--------------------------------------------------------------------------*/
$.gulp.task("browserSync", ()=>{
	$.browserSync.init({
		server: {
			baseDir: PATH.htdocs
		}
	});
});


/*--------------------------------------------------------------------------
	css
--------------------------------------------------------------------------*/
$.gulp.task("sass", ()=>{
	$.plugins.rubySass(PATH.develop + "**/*.scss", {
		style: IS_REL ? "compressed" : "expanded"
	})
	.pipe($.plugins.plumber())
	.pipe($.plugins.pleeease({
		browsers  : ["last 2 version", "Android 4.4"],
		minifier  : false,
		sourcemaps: false,
		mqpacker  : false
	}))
	.pipe($.gulp.dest(PATH.htdocs));
});


/*--------------------------------------------------------------------------
	js
--------------------------------------------------------------------------*/
$.gulp.task("js", ()=>{
	var dev = PATH.develop + "assets/js/",
	dest = PATH.htdocs + "assets/js/";

	// concat
	jsConcat([
		dev + "libs/core/*.js",
		dev + "libs/plugins/*.js"
	], dest, "libs.js");

	// JS用: js compile
	// jsCompile([
	// 	dev + "app/*.js",
	// 	dev + "app/utils/*.js",
	// 	dev + "app/class/*.js"
	// ], dest, "app.js");

	// Babel用: es compile
	esCompile(dev + "app-es/index.js", dest, "app.js");
});

// esCompile: Babel to ES -> min -> dest
function esCompile(src, dest, fileName){
	if(fileName){
		compile(src, fileName);
	} else {
		$.fs.readdir(src, function (err, list) {
			if (err) {
				console.error(err);
				process.exit(1);
			} else {
			  for (var i = 0; i < list.length; i++) {
					if(list[i].indexOf('.js') > 0){
						compile(src + list[i] ,list[i]);
					}
				}
			}
		});
	}

	function compile(src, fileName){
		$.browserify(src)
		.transform("babelify", {
			presets: [
				["env", {"targets": {"browsers": ["last 2 versions"]}}]
			]
	  })
		.bundle()
		.on("error", (err)=>{ console.log("Error : " + err.message); })
		.pipe($.source(fileName))
		.pipe($.buffer())
		.pipe($.plugins.plumber())
		.pipe($.plugins.if(IS_REL, $.plugins.removeLogging()))
		.pipe($.plugins.if(IS_REL, $.plugins.uglify()))
		.pipe($.gulp.dest(dest));
	}
};

// jsConcat: concat -> dest
function jsConcat(src, dest, fileName){
	if(typeof src === "string"){
		src = [src];
	}
	$.gulp.src(EXCLUDED.concat(src))
	.pipe($.plugins.plumber())
	.pipe($.plugins.concat(fileName))
	.pipe($.gulp.dest(dest));
};

// jsCompile: concat -> min -> dest
function jsCompile(src, dest, fileName){
	if(typeof src === "string"){
		src = [src];
	}
	$.gulp.src(EXCLUDED.concat(src))
	.pipe($.plugins.plumber())
	.pipe($.plugins.jshint())
	.pipe($.plugins.jshint.reporter("jshint-stylish"))
	.pipe($.plugins.concat(fileName))
	.pipe($.plugins.if(IS_REL, $.plugins.removeLogging()))
	.pipe($.plugins.if(IS_REL, $.plugins.uglify()))
	.pipe($.gulp.dest(dest));
};


/*--------------------------------------------------------------------------
	shader
--------------------------------------------------------------------------*/
$.gulp.task("shader", null, ()=>{
	$.gulp.src(PATH.develop + "assets/shader/**/*.{vert,frag,glsl}")
	.pipe($.plugins.plumber())
	.pipe($.plugins.glslify())
	.pipe($.gulp.dest(PATH.htdocs + "assets/shader"));
});
