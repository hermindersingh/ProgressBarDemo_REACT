var argv = require('yargs').argv,

    gulp       = require('gulp'),
    gutil      = require('gulp-util'),
    gulpif     = require('gulp-if'),

    source     = require('vinyl-source-stream'),
    buffer     = require('vinyl-buffer'),
    sourcemaps = require('gulp-sourcemaps'),
    browserify = require('browserify'),
    watchify   = require('watchify'),
    reactify   = require('reactify'),
    uglify     = require('gulp-uglify'),

    less       = require('gulp-less'),
    minifyCSS  = require('gulp-minify-css');

// Directory where static files are found. Don't forget the slash at the end.
var staticDirectory = 'app/',

    // Source and target JS files for Browserify
    jsMainFile      = staticDirectory + 'src/BarComponent.jsx',
    jsBundleFile    = 'src-minified/bundle.js',

    // Source and target LESS files
    cssMainFile     = staticDirectory + 'css/pagestyles.less',
    cssFiles        = staticDirectory + 'css/**/*.less';

// Browserify bundler, configured for reactify with sources having a .jsx extension
var bundler = browserify({
    entries: [jsMainFile],
    transform: [reactify],
    extensions: ['.jsx'],
    debug: !argv.production,
    cache: {}, packageCache: {}, fullPaths: true // for watchify
});

// Build JavaScript using Browserify
gulp.task('js', function() {
    return bundler
        .bundle()
        .pipe(source(jsBundleFile))
        .pipe(buffer())
        .pipe(gulpif(!argv.production, sourcemaps.init({loadMaps: true}))) // loads map from browserify file
        .pipe(gulpif(!argv.production, sourcemaps.write('./'))) // writes .map file
        .pipe(gulpif(argv.production, uglify()))
        .pipe(gulp.dest(staticDirectory));
});

// Build CSS
gulp.task('css', function(){
    return gulp.src(cssMainFile)
        .pipe(less())
        .pipe(gulpif(argv.production, minifyCSS({keepBreaks:true})))
        .pipe(gulp.dest(staticDirectory));
});

// Watch JS + CSS using watchify + gulp.watch

gulp.task('watchify', function() {
    var watcher  = watchify(bundler);
    return watcher
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .on('update', function () {
        watcher.bundle()
        .pipe(source(jsBundleFile))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
        .pipe(sourcemaps.write('./')) // writes .map file
        .pipe(gulp.dest(staticDirectory));

        gutil.log("Updated JavaScript sources");
    })
    .bundle() // Create the initial bundle when starting the task
    .pipe(source(jsBundleFile))
    .pipe(gulp.dest(staticDirectory));
});

gulp.task('csswatch', function () {
    gulp.watch(cssFiles, ['css']);
});

gulp.task('watch', ['watchify', 'csswatch']);
gulp.task('default', ['js', 'css']);