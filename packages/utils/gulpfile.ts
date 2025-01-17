import { buildPackages } from '../../build/packages'

// 每个packages都单独写太麻烦了，所以再build目录中创建公共的方法，传入文件路径和模块名来统一输出
export default buildPackages(__dirname, 'utils')
