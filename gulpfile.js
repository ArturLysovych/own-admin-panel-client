const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const htmlmin = require('gulp-htmlmin');

function compileSass() {
    return gulp.src('src/login-scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('dist/login-css'))
}

function minifyJS() {
    return gulp.src('src/login-js/*.js')
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/login-js'))
}

function minifyHTML() {
    return gulp.src('src/login.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('/dist/'))
}

function watch() {
    gulp.watch('src/login-scss/*.scss', compileSass);
    gulp.watch('src/login-js/*.js', minifyJS);
    gulp.watch('src/login.html', minifyHTML);
}

exports.default = gulp.series(gulp.parallel(minifyHTML, compileSass, minifyJS), watch);