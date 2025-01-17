// 打包样式
import dartSass from 'sass'
import gulpSass from 'gulp-sass'
import gulpAutoprefixer from 'gulp-autoprefixer'
import gulpCleanCss from 'gulp-clean-css'
import path from 'path'
import { series, src, dest } from 'gulp'

// 编译方法
function compile() {
  const sass = gulpSass(dartSass)
  // 匹配src目录下所有以.scss结尾的文件
  return src(path.resolve(__dirname, './src/**/*.scss'))
    .pipe(sass.sync()) // 通过sass来进行处理
    .pipe(gulpAutoprefixer()) // 添加前缀
    .pipe(gulpCleanCss()) // 压缩
    .pipe(dest('./dist/css')) // 输出到当前目录/dist/css中
}

// 拷贝字体文件，如icon-font等
function copyFont() {
  return src(path.resolve(__dirname, './src/fonts/**')).pipe(gulpCleanCss()).pipe(dest('./dist/font'))
}

// 拷贝打包好的dist目录到外层最终输出的 dist/theme 目录中
function copyFullStyle() {
  return src(path.resolve(__dirname, './dist/**')).pipe(dest(path.resolve(__dirname, '../../dist/theme')))
}

// 串行执行任务
export default series(compile, copyFont, copyFullStyle)
