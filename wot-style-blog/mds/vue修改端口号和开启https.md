---
date: 2020-06-15
categories: [技术,前端,Vue]
thumbnail: /images/fe/vue.jpg
toc: true
---

# vue开发环境修改本地启动的端口号
<!--more-->
当我们使用脚手架搭建项目时，react当中开发环境默认端口号是3000，vue是8080，我们也可以手动修改这个端口号。

## VUE 2.X
config文件夹中有一个index.js其中部分内容如下，port即为端口号，在这里更改即可。

```javascript
module.exports = {
    dev: {
        env: require('./dev.env'),
        port: 8080,    // 端口号
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {},
        // CSS Sourcemaps off by default because relative paths are "buggy"
        // with this option, according to the CSS-Loader README
        // (https://github.com/webpack/css-loader#sourcemaps)
        // In our experience, they generally work as expected,
        // just be aware of this issue when enabling this option.
        cssSourceMap: false,
      }
};
```

## VUE 3.X
vue3版本之后使用脚手架搭建的项目不再有暴露的配置文件，而是将默认设置放在了node_module中，因此当我们需要配置vue项目时需要在根目录手动床架一个文件```vue.config.js```

创建之后进行如下配置：

```javascript
module.exports = {
    devServer: {
        port: 8080,     // 端口号
    }
};
```

# VUE设置https启动
有时候我们在本地调试需要开启https，但是脚手架搭建的项目，默认是不开启https的，同样的在vue.config.js中设置：

```javascript
devServer: {
  	//....
    https: true
  }
```
