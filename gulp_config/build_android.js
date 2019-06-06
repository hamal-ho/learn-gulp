const shell = require('shelljs')
const { src, dest, series } = require('gulp')

const webPath = 'eim/src/4.Mobile'
let temp = webPath.split('/')
temp.pop()
const appPath = temp.map(() => '..').join('/') + '/vue-app'

function build_web (cd) {
  console.log('开始编译web...')
  shell.cd(`../${webPath}`).exec('npm run buildapp')
  console.log('web编译完成...')
  cd()
}

function copyFile (cd) {
  console.log('开始复制')
  src('../eim/src/4.Mobile/dist/*').pipe(dest('../vue-app/www'))
  console.log('复制完成')
  cd()
}

function build_android (cd) {
  console.log('开始打包...')
  shell.cd(`../${appPath}`).exec('cordova build android')
  console.log('打包完成...')
  cd()
}
exports.build_android = series([build_web, copyFile, build_android])
