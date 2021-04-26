const prodGzipList = ['js', 'css']
import CompressionWebpackPlugin from 'compression-webpack-plugin'

module.exports = {
  chainWebpack: config => {
    if (process.env.NODE_ENV === 'production') {  // 生产模式开启
      config.plugin('compression-webpack-plugin')
        .use(
          new CompressionWebpackPlugin({
            // filename: 文件名称，这里我们不设置，让它保持和未压缩的文件同一个名称
            algorithm: 'gzip', // 指定生成gzip格式
            test: new RegExp('\\.(' + prodGzipList.join('|') + ')$'), // 匹配哪些格式文件需要压缩
            threshold: 10240, //对超过10k的数据进行压缩
            minRatio: 0.6 // 压缩比例，值为0 ~ 1
          })
        )
    }
  }
}
