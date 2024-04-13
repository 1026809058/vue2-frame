/**
 * @description 导出默认通用配置
 */
const setting = {
  //开发以及部署时的URL，hash模式时在不确定二级目录名称的情况下建议使用""代表相对路径或者"/二级目录/"，history模式默认使用"/"或者"/二级目录/"
  publicPath: process.env.NODE_ENV === "production" ? "" : "./",
  //标题
  title: "项目框架",
  //标题分隔符
  titleSeparator: " - ",
  //标题是否反转 如果为false:"page - title"，如果为ture:"title - page"
  titleReverse: false,
  //生产环境构建文件的目录名
  outputDir: "dist",
  // 开发时使用端口
  devPort: "8090",
  //是否开启登录拦截
  loginInterception: false,
  //token在localStorage、sessionStorage、cookie存储的key的名称
  tokenName: "token",
  //token存储位置localStorage sessionStorage cookie
  storage: "sessionStorage",
  //路由模式，可选值为 history 或 hash
  routerMode: "hash",
  buildzip: true,
};
module.exports = setting;
