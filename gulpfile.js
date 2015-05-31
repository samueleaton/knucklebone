var gulp = require("gulp");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");
var stripDebug = require("gulp-strip-debug");

gulp.task("uglify", function(){
	gulp.src("knucklebone.js")
	.pipe(uglify())
	.pipe(rename("knucklebone.min.js"))
	.pipe(stripDebug())
	.pipe(gulp.dest("./"));
});

