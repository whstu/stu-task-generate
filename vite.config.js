const { defineConfig } = require('vite');

module.exports = defineConfig({
  logLevel: 'info', // 输出较详细的调试信息；可使用 'debug' 获得更多日志
  server: {
    open: true
  },
  build: {
    outDir: 'dist' // 部署时使用的静态文件目录
  }
});
