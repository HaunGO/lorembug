var gulp = require('gulp'),
    babel = require('gulp-babel'),
    sass = require('gulp-sass');


var Static = {
	files: [
		'src/images/*',
		'src/views/*',
		'src/public/img/*'
		],
	options: {
		base: 'src'
	},
	dest: 'dist'
};

var Babel = {
	files: [
		'src/app.js',
		'src/public/js/*'
	],
	options: {
		base: 'src'
	},
	dest: 'dist'
};

var Sass = {
	files: [
		'src/public/css/master.sass'
	],
	options: {
		base: 'src'
	},
	dest: 'dist'
};

gulp.task('default', ['static'], function() {
	return gulp
		.src(['package.json'])
		.pipe(gulp.dest(Static.dest));
});

gulp.task('static', ['sass', '6to5'], function() {
	return gulp
		.src(Static.files, Static.options)
		.pipe(gulp.dest(Static.dest));
});

gulp.task('sass', function() {
	return gulp
		.src(Sass.files, Sass.options)
		.pipe(sass())
		.pipe(gulp.dest(Sass.dest));
})

gulp.task('6to5', function() {
	return gulp
		.src(Babel.files, Babel.options)
		.pipe(babel({presets: ['es2015']}))
		.pipe(gulp.dest(Babel.dest));
})