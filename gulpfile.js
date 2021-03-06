const gulp = require('gulp');
const browserSync = require('browser-sync');
//const pug = require('gulp-pug');
const sass = require('gulp-sass');
//const spritesmith = require('gulp.spritesmith');
const rimraf = require('rimraf');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');



// /*---------Pug compile---------*/
//
// gulp.task('pug', function buildHTML() {
//     return gulp.src('source/template/*.pug')
//         .pipe(pug({
//             pretty: true
//         }))
//         .pipe(gulp.dest('build'));
// });

/*---------Sass compile---------*/

gulp.task('sass', function () {
    return gulp.src('sass/main.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename('styles.css'))
        .pipe(gulp.dest('build/css'))
});


// /*---------Sprite Compile---------*/
//
// gulp.task('sprite', function (cb) {
//     const spriteData = gulp.src('source/images/icons/*.png').pipe(spritesmith({
//         imgName: 'sprite.png',
//         imgPath: '../images/sprite.png',
//         cssName: 'sprite.scss'
//     }));
//     spriteData.img.pipe(gulp.dest('build/images/'));
//     spriteData.css.pipe(gulp.dest('source/styles/global/'));
//     cb();
// });


/*---------Clear Build Directory---------*/

gulp.task('clear', function del(cb) {
    return rimraf('build', cb);
});


/*---------BrowserSync---------*/
gulp.task('server', function () {
    browserSync.init({
        server: {
            port: 9000,
            baseDir: "build"
        }
    });

    gulp.watch('build/**/*').on('change', browserSync.reload);
});

/*---------Copy Fonts---------*/
gulp.task('copy:fonts', function () {
    return gulp.src('./fonts/**/*.*')
        .pipe(gulp.dest('build/css'));
});

/*---------Copy Images---------*/
gulp.task('copy:images', function () {
    return gulp.src('./img/**/*.*')
        .pipe(gulp.dest('build/img'));
});

/*---------Copy HTML---------*/
gulp.task('copy:html', function () {
    return gulp.src('./index.html')
        .pipe(gulp.dest('build'));
});


/*---------Copy ALL---------*/
gulp.task('copy', gulp.parallel('copy:fonts','copy:images'));


/*---------AutoPrefixer---------*/
gulp.task('prefixer', () =>
    gulp.src('build/css/styles.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('build/css/'))
);

/*---------Watchers---------*/

gulp.task('watch', function () {
    gulp.watch('index.html', gulp.series('copy:html'));
   // gulp.watch('source/template/**/*.pug', gulp.series('pug'));
    gulp.watch('sass/**/*.scss', gulp.series('sass', 'prefixer'));
});

/*---------Default---------*/

gulp.task('default', gulp.series(
    'clear',
    gulp.parallel('copy:html', 'sass', 'copy'),
    gulp.parallel('prefixer'),
    gulp.parallel('watch', 'server')
));



