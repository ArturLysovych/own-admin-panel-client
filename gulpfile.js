const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const htmlmin = require('gulp-htmlmin');

// Compile Sass for login and panel
function compileSass() {
    return gulp.src(['src/login-scss/*.scss', 'src/panel-scss/*.scss', 'src/logpanel-scss/*.scss', 'src/user-scss/*.scss'], { base: 'src' })
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('dist'));
}

// Minify JS for login and panel
function minifyJs() {
    return gulp.src(['src/login-js/*.js', 'src/panel-js/*.js', 'src/user-js/*.js', 'src/logpanel-js/*.js'], { base: 'src' })
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist'));
}


// Minify HTML for login and panel
function minifyHTML() {
    return gulp.src(['src/login.html', 'src/panel.html', 'src/user.html', 'src/logpanel.html'])
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('dist/'));
}

// Watch for changes
function watch() {
    gulp.watch(['src/login-scss/*.scss', 'src/panel-scss/*.scss', 'src/user-scss/*.scss', 'src/logpanel-scss/*.scss'], compileSass);
    gulp.watch(['src/login-js/*.js', 'src/panel-js/*.js', 'src/user-js/*.js', 'src/logpanel-js/*.js'], minifyJs);
    gulp.watch(['src/login.html', 'src/panel.html', 'src/user.html', 'src/logpanel.html'], minifyHTML);
}

exports.default = gulp.series(
    gulp.parallel(minifyHTML, compileSass, minifyJs), watch
);
