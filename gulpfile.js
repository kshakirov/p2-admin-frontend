// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var server = require('gulp-express');
var cleanCSS = require('gulp-clean-css');

gulp.task('minify-css', function () {
    return gulp.src(
        ['app/bower_components/bootstrap/dist/css/bootstrap.css',
        'app/bower_components/ng-table-bundle/ng-table.css',
        'app/css/navbar_custom.css']
    )
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(concat('style.min.css'))
        .pipe(gulp.dest('app/dist/css'));
});

// Lint Task
gulp.task('lint', function() {
    return gulp.src('app/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src('scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('dist/css'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src([
        'app/bower_components/jquery/dist/jquery.js',
        'app/bower_components/jquery-ui/jquery-ui.js',
        'app/bower_components/ace-builds/src-noconflict/ace.js',
        'app/bower_components/ace-builds/src-noconflict/theme-cobalt.js',
        'app/bower_components/ace-builds/src-noconflict/mode-groovy.js',
        'app/bower_components/ace-builds/src-noconflict/mode-ruby.js',
        'app/bower_components/ace-builds/src-noconflict/mode-python.js',
        'app/bower_components/ace-builds/src-noconflict/mode-javascript.js',
        'app/bower_components/angular/angular.js',
        'app/bower_components/angular-ui-ace/ui-ace.js',
        'app/bower_components/angular-route/angular-route.js',
        'app/bower_components/jquery/dist/jquery.js',
        'app/bower_components/bootstrap/dist/js/bootstrap.js',
        'app/bower_components/ng-table-bundle/ng-table.js',
        'app/bower_components/angular-ui-sortable/sortable.js',
        'app/bower_components/chart.js/dist/Chart.js',
        'app/bower_components/angular-chart.js/angular-chart.js',
        'app/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
        'app/bower_components/angular-spinner/dist/angular-spinner.js',
        'app/bower_components/angular-cookies/angular-cookies.js',
        'app/bower_components/ng-file-upload/ng-file-upload.js',
        'app/bower_components/angular-bootstrap-multiselect/dist/angular-bootstrap-multiselect.js',
        'app/bower_components/angular-file-saver/dist/angular-file-saver.bundle.js',
        'app/bower_components/socket.io-client/dist/socket.io.js',
        'app/bower_components/angular-socket-io/socket.js',
        'app/bower_components/ng-notify/src/scripts/ng-notify.js',
        'app/bower_components/angularjs-datepicker/dist/angular-datepicker.js',
        'app/bower_components/angular-confirm/js/angular-confirm.js',
        'app/bower_components/angular-uuid/uuid.js',
        'app/bower_components/angular-loading-bar/src/loading-bar.js',
        'app/bower_components/moment/moment.js',
        'app/bower_components/angular-moment/angular-moment.js',
        'app/js/app.js',
        'app/js/services.js',
        'app/js/**/*.js'
    ])
        .pipe(concat('all.js'))
        .pipe(gulp.dest('app/dist'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/dist/js'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('js/*.js', ['lint', 'scripts']);
    gulp.watch('scss/*.scss', ['sass']);
});

gulp.task('server', function () {
    // Start the server at the beginning of the task
    server.run(['app.js']);

    // Restart the server when file changes
    gulp.watch(['app/**/*.html'], server.notify);
    gulp.watch(['app/styles/**/*.scss'], ['styles:scss']);
    gulp.watch(['{.tmp,app}/styles/**/*.css'], function(event){
        gulp.run('styles:css');
        server.notify(event);

    });

    gulp.watch(['app/js/**/*.js'], ['lint']);
    gulp.watch(['app/images/**/*'], server.notify);
    gulp.watch(['app.js', 'routes/**/*.js'], [server.run]);
});

gulp.task('connect', function () {
    // Start the server at the beginning of the task
    server.run(['app.js']);
    });

// Default Task
gulp.task('default', ['lint',  'watch', 'connect']);
gulp.task('dist', ['lint', 'sass', 'minify-css',  'scripts', 'connect']);
