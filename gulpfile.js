var path                   = require('path'),
		gulp                   = require('gulp'),
    browserSync            = require('browser-sync').create(),
		autoprefixer           = require('gulp-autoprefixer'),
		cleanCSS               = require('gulp-clean-css'),
    uglify                 = require('gulp-uglify'),
    pipeline               = require('readable-stream').pipeline,
    imagemin               = require('gulp-imagemin'),
    tinypng                = require('gulp-tinypng-compress'),
    cache                  = require('gulp-cache'),
    del                    = require('del');
    
gulp.task('html-replace', function (done) {
    return gulp.src('src/*.html')
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream());
        done();
});

gulp.task('html-replace-eng', function () {
    return gulp.src('src/eng/*.html')
        .pipe(gulp.dest('dist/eng'))
        .pipe(browserSync.stream());
});

gulp.task('clean-autoprefixer', function () {
	return gulp.src('src/css/*.css')
		.pipe(autoprefixer({
			browsers: ['last 15 versions', '> 1%', 'ie 8', 'ie 7'],
			cascade: true
		}))
		.pipe(cleanCSS({
			level: {2: {restructureRules: true}}
		}))
		.pipe(gulp.dest('dist/css'))
		.pipe(browserSync.stream());
});

gulp.task('clean-autoprefixer-eng', function () {
	return gulp.src('src/eng/css/*.css')
		.pipe(autoprefixer({
			browsers: ['last 15 versions', '> 1%', 'ie 8', 'ie 7'],
			cascade: true
		}))
		.pipe(cleanCSS({
			level: {2: {restructureRules: true}}
		}))
		.pipe(gulp.dest('dist/eng/css'))
		.pipe(browserSync.stream());
});

gulp.task('uglify', function () {
	return pipeline(
		gulp.src('src/js/*.js'),
		uglify(),
		gulp.dest('dist/js'),
		browserSync.stream()
	);
});

gulp.task('uglify-eng', function () {
	return pipeline(
		gulp.src('src/eng/js/*.js'),
		uglify(),
		gulp.dest('dist/eng/js'),
		browserSync.stream()
	);
});

gulp.task('images1', function (done) {
	return gulp.src('src/img/*{png,jpg,jpeg}')
		.pipe(tinypng({
			key: 'E5VZkBXIuSvfEHot5rBkLgTjlcWVbwqv',
			sigFile: 'images/.tinypng-sigs',
			log: true
		}))
		.pipe(gulp.dest('dist/img'))
        .pipe(browserSync.stream());
        done();
});

gulp.task('images1-eng', function () {
	return gulp.src('src/eng/img/*{png,jpg,jpeg}')
		.pipe(tinypng({
			key: 'E5VZkBXIuSvfEHot5rBkLgTjlcWVbwqv',
			sigFile: 'images/.tinypng-sigs',
			log: true
		}))
		.pipe(gulp.dest('dist/eng/img'))
        .pipe(browserSync.stream());
});

gulp.task('images2', function (done) {
	return gulp.src('src/img/*{svg,gif}')
		.pipe(cache(imagemin([
			imagemin.svgo({
				plugins: [
					{optimizationLevel: 3},
					{progessive: true},
					{interlaced: true},
					{removeViewBox: false},
					{removeUselessStrokeAndFill: false},
					{cleanupIDs: false}
				]
			}),
			imagemin.gifsicle({
				optimizationLevel: 3,
				interlaced: true
			})
		])))
		.pipe(gulp.dest('dist/img'))
        .pipe(browserSync.stream());
        done();
});

gulp.task('images2-eng', function () {
	return gulp.src('src/eng/img/*{svg,gif}')
		.pipe(cache(imagemin([
			imagemin.svgo({
				plugins: [
					{optimizationLevel: 3},
					{progessive: true},
					{interlaced: true},
					{removeViewBox: false},
					{removeUselessStrokeAndFill: false},
					{cleanupIDs: false}
				]
			}),
			imagemin.gifsicle({
				optimizationLevel: 3,
				interlaced: true
			})
		])))
		.pipe(gulp.dest('dist/eng/img'))
		.pipe(browserSync.stream());
});

gulp.task('browser-sync', function (){
	browserSync.init({
		server: {
    	baseDir: "dist"
		},
		notify: false
    });
    gulp.watch('src/*.html', gulp.series('html-replace')).on('unlink', function (filepath) {
		var htmlPathFromSrc = path.relative(path.resolve('src'), filepath);
		var destHtmlPath = path.resolve('dist', htmlPathFromSrc);
		del.sync(destHtmlPath);
    });
    gulp.watch('src/eng/*.html', gulp.series('html-replace-eng')).on('unlink', function (filepath) {
		var htmlPathFromSrc = path.relative(path.resolve('src/eng'), filepath);
		var destHtmlPath = path.resolve('dist/eng', htmlPathFromSrc);
		del.sync(destHtmlPath);
    });
    gulp.watch('src/css/*.css', gulp.series('clean-autoprefixer'));
    gulp.watch('src/eng/css/*.css', gulp.series('clean-autoprefixer-eng'));
    gulp.watch('src/js/*.js', gulp.series('uglify'));
    gulp.watch('src/eng/js/*.js', gulp.series('uglify-eng'));
	gulp.watch('src/img/*', gulp.series('images1', 'images2')).on('unlink', function (filepath) {
		var imgPathFromSrc = path.relative(path.resolve('src/img'), filepath);
		var destImgPath = path.resolve('dist/img', imgPathFromSrc);
		del.sync(destImgPath);
    });
    gulp.watch('src/eng/img/*', gulp.series('images1-eng', 'images2-eng')).on('unlink', function (filepath) {
		var imgPathFromSrc = path.relative(path.resolve('src/eng/img'), filepath);
		var destImgPath = path.resolve('dist/eng/img', imgPathFromSrc);
		del.sync(destImgPath);
	});
	gulp.watch('dist/**/*.html').on('change', browserSync.reload);
});

gulp.task('default', gulp.series('html-replace', 'html-replace-eng', 'clean-autoprefixer', 'clean-autoprefixer-eng', 'uglify', 'uglify-eng', 'images1', 'images1-eng', 'images2', 'images2-eng', 'browser-sync'));