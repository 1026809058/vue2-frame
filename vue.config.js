/* eslint-disable prettier/prettier */
const path = require("path");
const { devPort, title, publicPath, buildzip } = require("./src/config");
const { version } = require("./package.json");
const FileManagerPlugin = require("filemanager-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
process.env.VUE_APP_TITLE = title;
process.env.VUE_APP_VERSION = version;

const resolve = (dir) => {
  return path.join(__dirname, dir);
};
module.exports = {
  // 生产环境是否要生成 sourceMap
  productionSourceMap: false,
  // 部署应用包时的基本 URL,用法和 webpack 本身的 output.publicPath 一致
  publicPath,
  // build 时输出的文件目录
  outputDir: "dist",
  // 放置静态文件夹目录
  assetsDir: "assets",
  //   dev环境下，webpack-dev-server 相关配置
  devServer: {
    // 开发运行时的端口
    port: devPort,
    //开发运行时域名，设置成'0.0.0.0',在同一个局域网下，如果你的项目在运行，同时可以通过你的http://ip:port/...访问你的项目
    host: "0.0.0.0",
    //是否启用 https
    https: false,
    //npm run serve 时是否直接打开浏览器
    open: true,
    // proxy: {
    //   "/api": {
    //     target: "http://***", // 请求地址
    //     changeOrigin: true, // 在vue-cli3中，默认changeOrigin的值是true,意味着服务器host设置成target，这与vue-cli2不一致，vue-cli2这个默认值是false
    //     // changeOrigin的值是true,target是host, request URL是http://baidu.com
    //     // 如果设置changeOrigin: false，host就是浏览器发送过来的host，也就是localhost:8082。
    //     pathRewrite: {
    //       // 路径重写，eg:把api接口替换为''
    //       "^/aipc.cgi": "",
    //     },
    //   },
    // },
  },
  configureWebpack: (config) => {
    // 例如，通过判断运行环境，设置mode
    if (process.env.NODE_ENV === "production") {
      // 为生产环境修改配置...
      config.mode = "production";

      // 移除console及注释
      config.plugins.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            warnings: false,
            compress: {
              // 移除 debugger
              drop_debugger: true,
              // 移除console.*函数
              drop_console: true,
              // 移除console.log的引用
              // 例如 log = console.log, 移除log，同时移除console.log
              pure_funcs: ["console.log"],
            },
          },
          // 多进程并行运行
          parallel: true,
          // 启用缓存
          cache: true,
          // 抽取注释
          extractComments: true,
        })
      );
    } else {
      // 为开发环境修改配置...
      config.mode = "development";
    }

    // 打包压缩
    if (buildzip) {
      config.plugins.push(
        new FileManagerPlugin({
          events: {
            onEnd: {
              delete: ["./dist.zip"],
              archive: [
                {
                  source: path.join(__dirname, "./dist"),
                  destination: path.join(__dirname, "./dist.zip"),
                },
              ],
            },
          },
        })
      );
    }

    return {
      resolve: {
        alias: {
          "@": resolve("src"),
          "*": resolve(""),
        },
      },
      plugins: [],
    };
  },
  chainWebpack: (config) => {},
};
