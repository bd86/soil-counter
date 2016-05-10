'use strict';

var gulp    = require('gulp');
var sass    = require('gulp-sass');
var gutil   = require('gulp-util');
var ftp     = require('vinyl-ftp');
var open    = require('gulp-open');
var connect = require('gulp-connect');
var notify  = require("gulp-notify");

//THIS CAN BE SET IN .bashrc OR .bash_profile
//process.env.FTP_USER
//process.env.FTP_PWD

var localFilesGlob = [
        'ajax/*',
        'css/*',
        'file/*',
        'img/*',
        'js/*',,
        'privacy.html',
        'index.html'
    ];
var remoteFolder = '/public_html';

var reportError = function (error) {
    var lineNumber = (error.line) ? 'LINE ' + error.line + ' -- ' : '';

    notify({
        title: 'Task Failed [' + error.plugin + ']',
        message: lineNumber + 'See console.',
        //sound: 'Sosumi' See: https://github.com/mikaelbr/node-notifier#all-notification-options-with-their-defaults
    }).write(error);

    //gutil.beep(); // Beep 'sosumi' again

    // Inspect the error object
    //console.log(error);

    // Easy error reporting
    //console.log(error.toString());

    // Pretty error reporting
    var report = '';
    var chalk = gutil.colors.white.bgRed;

    report += chalk('TASK:') + ' [' + error.plugin + ']\n';
    report += chalk('PROB:') + ' ' + error.message + '\n';
    if (error.line) { report += chalk('LINE:') + ' ' + error.line + '\n'; }
    if (error.file)   { report += chalk('FILE:') + ' ' + error.file + '\n'; }
    console.error(report);
}

function getFtpConnection() {
    return ftp.create({
        host: host,
        port: port,
        user: user,
        password: password,
        parallel: 8,
        log: gutil.log
    });
}

gulp.task('connect', function() {
    connect.server({
        port: 3000,
        livereload: true
    });
});

gulp.task('html', function() {
    gulp.src('./*.html')
        .pipe(connect.reload());
});

gulp.task('sass', function() {
    gulp.src('./scss/*.scss')
        .pipe(sass().on('error', function(err){
            reportError(err);
        }))       
        .pipe(gulp.dest('./css'))
        .pipe(connect.reload());
});

gulp.task('js', function() {
    gulp.src('./js/*.js')
        .pipe(connect.reload());
});

gulp.task('watch', function() {
    gulp.watch(['./scss/*.scss'], ['sass']);
    gulp.watch(['./*.html'], ['html']);
    gulp.watch(['./js/*.js'], ['js']);
});

gulp.task('minifyCss', function() {
    return gulp.src('./scss/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('./css'));
});

gulp.task('site', function() {
    var options = {
        uri: 'http://localhost:3000',
        app: 'chrome'
    };
    gulp.src('./index.html')
        .pipe(open(options));
});

gulp.task('deploy', function() {
    var conn = getFtpConnection();

    return gulp.src(localFilesGlob, {base: '.', buffer: false})
        .pipe(conn.newer(remoteFolder))
        .pipe(conn.dest(remoteFolder));
});

gulp.task('build',['minifyCss']);
gulp.task('default', ['connect', 'watch','site']);