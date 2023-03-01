// const BundleAnalyzerPlugin =
//   require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const { defineConfig } = require("@vue/cli-service");

const env = process.env.NODE_ENV;
const path = require("path");
const resolve = (dir) => {
  return path.join(__dirname, dir);
};

const cdn = {
  dev: {
    css: [],
    js: [],
  },
  build: {
    css: [],
    js: [
      "https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.min.js",
      "https://cdn.jsdelivr.net/npm/vue-router@3.5.1/dist/vue-router.min.js",
    ],
  },
};
module.exports = defineConfig({
  devServer: {
    port: 8080, // 开发服务器端口
  },
  transpileDependencies: true,
  // 去除sourceMap
  productionSourceMap: false,
  // 关闭eslint
  lintOnSave: false,
 
  chainWebpack: (config) => {
    // 删除preload和prefetch
    config.plugins.delete("preload");
    config.plugins.delete("prefetch");
    // config.plugin("webpack-bundle-analyze").use(
    //   new BundleAnalyzerPlugin({
    //     openAnalyzer: false, //默认不打开浏览器
    //     analyzerPort: 8777,
    //   })
    // );
    // CDN注入HTML模板
    config.plugin("html").tap((args) => {
      if (process.env.NODE_ENV === "production") {
        args[0].cdn = cdn.build;
        console.log("【生产环境CDN注入//////】");
      }
      if (process.env.NODE_ENV === "development") {
        args[0].cdn = cdn.dev;
        console.log("【开发环境不注入CDN//////】");
      }
      return args;
    });
    config.optimization.minimizer("terser").tap((args) => {
      args[0].parallel = 4;
      args[0].terserOptions.compress.warnings = true;
      args[0].terserOptions.compress.drop_debugger = true;
      args[0].terserOptions.compress.drop_console = true;
      return args;
    });
  },
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === "production") {
      
      config.externals = {
        vue: "Vue",
        "vue-router": "VueRouter",
      };
    }
  },
});