var path = require('path');
var gulp = require('gulp');
var code = require('gulp-code');
var webpack = require('gulp-webpack');
var uglify = require('gulp-uglify');
var react = require('gulp-react');
var named = require('vinyl-named');
var exec = require('child_process').exec;

//引入包配置
var pkg = require('./package.json');

function onError(err){
  console.log(err);
  this.emit('end');
}

//注册css构建任务
gulp.task('css', function () {
  return gulp.src('demo/**/*.css')
    .pipe(code.lint())       //css代码检查
    .pipe(code.minify())     //css代码压缩
    .pipe(gulp.dest('dist/'))
});

//注册js构建任务
gulp.task('js', function () {
  return gulp.src(['src/**/*.js', 'demo/**/*.js'])
    .pipe(code.lint())  //js代码检查
    .pipe(react())      // complie React JSX template
    .on('error', onError)
    .pipe(gulp.dest('build/'));
});

gulp.task('build', ['js'], function(){
  return gulp.src('build/**/*.js')
    // .pipe(uglify())
    .pipe(gulp.dest('build/'));
});

gulp.task('pack', ['build', 'css'], function(){
  return gulp.src(['build/slide/slide.js', 'build/tree/tree.js'])
    .pipe(named())
    .pipe(webpack({
      // entry: {
      //   // tree  : 'build/demo/tree/index.js',
      //   slide : 'build/slide/index.js'
      // },
      output: {
        // filename: '[name].js',
        libraryTarget: 'umd'
      }
      // resolve: {
      //   alias: {
      //     'ui': '..'
      //   }
      // }
    }))
    .on('error', onError)
    .pipe(gulp.dest('dist/'));
  // exec('webpack ./build/index.js ./build/main.js;', function(err) {
  //   if (err) return console.log(err);
  // });
})

//注册资源构建任务
gulp.task('res', function () {
  return gulp.src('src/**/*.+(png|jpg|mp3|gif|swf)')
    .pipe(gulp.dest('build/'));
});

gulp.task('watch', function(){
  gulp.watch(['src/**/*.js', 'src/**/*.css', 'demo/**/*.js', 'demo/**/*.css'], ['pack']);
});

//注册一个默认任务
gulp.task('default', ['pack', 'res', 'watch']);