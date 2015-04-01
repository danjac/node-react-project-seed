var browserify = require('gulp-browserify'),
    bowerFiles = require('main-bower-files'),
    gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    shell = require('gulp-shell'),
    minifyCss = require('gulp-minify-css'),
    gulpFilter = require('gulp-filter'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    notify = require('gulp-notify'),
    browserSync = require('browser-sync')

var staticDir = './public',
    srcDir = './lib/frontend',
    cssFilter = gulpFilter('*.css'),
    jsFilter = gulpFilter('*.js'),
    fontFilter = gulpFilter(['*.eot', '*.woff', '*.svg', '*.ttf'])

var dest = {
    js: staticDir + '/js',
    css: staticDir + '/css',
    fonts: staticDir + '/fonts'
}


gulp.task('serve', ['build-src'], function() {
    browserSync.init({
        proxy: 'http://localhost:5000'
    })
})

gulp.task('build-src', function() {
    gulp.src(srcDir + '/app.js')
        .pipe(notify({message: "Build started"}))
        .pipe(plumber({
            errorHandler: notify.onError("Error: <%= error.message %>")
        }))
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(browserify({
            cache: {},
            packageCache: {},
            fullPaths: true,
            transform: [
                ["envify"],
                ["babelify"]
            ],
            extensions: ['.js', '.jsx']
        }))
        .pipe(uglify())
        .pipe(sourcemaps.write(dest.js))
        .pipe(gulp.dest(dest.js))
        .pipe(browserSync.reload({stream:true}))
        .pipe(notify({
            message: 'Build complete'
        }))

})

gulp.task('pkg', function() {
    // installs all the 3rd party stuffs.

    return gulp.src(bowerFiles({
            debugging: true,
            checkExistence: true,
            base: 'bower_components'
        }))
        .pipe(jsFilter)
        .pipe(uglify())
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest(dest.js))
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe(minifyCss())
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest(dest.css))
        .pipe(cssFilter.restore())
        .pipe(fontFilter)
        .pipe(gulp.dest(dest.fonts))
})

gulp.task('install', shell.task([
    'bower cache clean',
    'bower install'
]))

gulp.task('default', ['serve'], function() {
    gulp.start('install', 'pkg', 'build-src')
    gulp.watch(srcDir + '/**', {}, ['build-src'])
})
