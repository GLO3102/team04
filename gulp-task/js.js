var cte = require('./constante.js');
var hlp = require('./helper.js');

var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

var paths = {
    src: cte.basePaths.src + 'src/',
    dest: cte.basePaths.dest + 'js/'
};

var appFiles = {
    src: [paths.src + '**/*.js'],
    destName: 'app.min.js'
};

var vendor = { // TODO en production, il faut utiliser un CDN pour ceux disponibles
    src: [
        cte.basePaths.bower + 'jquery/dist/jquery.js',
        cte.basePaths.bower + 'materialize/dist/js/materialize.js', // Materialize need JQuerygu
        cte.basePaths.bower + 'underscore/underscore.js'//,
        //  à activer quand nécessaire
        //cte.basePaths.bower + 'backbone/backbone.js', // Backbone need Underscore
        //cte.basePaths.bower + 'nunjucks/browser/nunjucks.js'

        // ajouter ici d'autres bibliothèques
    ],
    destName: 'vendor.min.js'
};

gulp.task('js:vendor:concat', function() {
    return gulp.src(vendor.src)
        .pipe(plumber({errorHandler: hlp.displayError}))
        .pipe(concat(vendor.destName))
        .pipe(getUglify())
        .pipe(gulp.dest(paths.dest));
});

gulp.task('js:app:concat', function() {
    return gulp.src(appFiles.src)
        .pipe(sourcemaps.init())
        .pipe(plumber({errorHandler: hlp.displayError}))
        .pipe(concat(appFiles.destName))
        .pipe(getUglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.dest));
});


gulp.task('js', ['js:vendor:concat', 'js:app:concat'], function() {
    gutil.log(hlp.styledString(' o/ Successfully processed Javascript files ', ['blue']));
});

function getUglify() {
    if (gutil.env.production) {
        return uglify({
            beautify: true,
            mangle: false
        }).on('error', function(err) {
            hlp.displayError(err);
        });
    } else {
        return gutil.noop();
    }
}

module.exports.watchable = appFiles.src;
