var gulp = require('gulp'),
    sass = require('gulp-sass'),
    imagemin = require('gulp-imagemin'),
    uglify = require('gulp-uglify'),
    plumber = require('gulp-plumber'),
    livereload = require('gulp-livereload'),
    prefix = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    htmlmin = require('gulp-htmlmin'),
    tinypng = require('gulp-tinypng'),
    csscomb = require('gulp-csscomb'),
    sourcemaps = require('gulp-sourcemaps');

//convert sass file naar css file
gulp.task('sass', function () {
  return gulp.src('src/scss/*.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(prefix('last 2 versions'))
        .pipe(gulp.dest('src/css'))
        .pipe(sass({style: 'compressed'}))
  //zorgt ervoor dat alle css3 opties automatiesch de juiste prefixes krijgen voor browsers die geen css3 opties ondersteunen
        .pipe(prefix('last 2 versions'))
  //voegt alle cssfiles samen in een bestand
        .pipe(csscomb())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/css'))
    //reaload pagina als (s)css bestanden zijn opgeslagen
        .pipe(livereload());
});

gulp.task('html', function () {
  return gulp.src('src/**/*.html')
        .pipe(plumber())
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('build'))
        .pipe(livereload());
});

//optimaliseer img files
gulp.task('jpgs', function () {
    return gulp.src('src/img/**/*.jpg')
        .pipe(imagemin({progressive: true}))
        .pipe(gulp.dest('build/img'));
});
gulp.task('tinypng', function () {
    gulp.src('src/img/**/*.png')
        .pipe(tinypng('t3BjW8U1LfeqUlq-4W8XRAe0ZSldZjrp'))
        .pipe(gulp.dest('build/img'));
});

//minify js files & plaats in build map
gulp.task('map', function () {
  gulp.src('src/js/maps/*.js')
        .pipe(plumber())
        .pipe(uglify())
  //voegt alle jsfiles samen in een bestand
        // .pipe(concat('maps.js'))
        .pipe(gulp.dest('build/js/maps'))
  //reaload pagina als js bestanden zijn opgeslagen
        .pipe(livereload());
});
gulp.task('uglify', function () {
  gulp.src('src/js/*.js')
        .pipe(plumber())
        .pipe(uglify())
  //voegt alle jsfiles samen in een bestand
        //.pipe(concat('script.js'))
        .pipe(gulp.dest('build/js'))
  //reaload pagina als js bestanden zijn opgeslagen
        .pipe(livereload());
});

//watch tasks
//bij veranderingen van een bestand update de build map
gulp.task('watch', function () {
  //zorgt ervoor dat live reload werkt
  var server = livereload({start: true});
  //nieuwe foto's direct comprimeren naar build map
    gulp.watch('src/img/**/*.jpg', ['jpgs']);
    gulp.watch('src/img/**/*.png', ['tinypng']);
  //als js bestanden veranderen --> uglify
    gulp.watch('src/js/*.js', ['uglify']);
    gulp.watch('src/js/maps/*js', ['map']);
  //als sass files veranderen --> sass taak
    gulp.watch('src/scss/**/*.scss', ['sass']);
    gulp.watch('src/**/*.html', ['html']);
});
//alle functies uitvoeren vervolgens start watch task
gulp.task('default', ['sass', 'html', 'jpgs', 'uglify', 'map', 'watch']);
