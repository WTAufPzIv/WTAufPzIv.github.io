---
date: 2020-07-28
categories: [技术,前端,webpack]
toc: true
---

# webpack的思想
Webpack 是一个打包模块化 JavaScript 的工具，在 Webpack 里一切文件皆模块，通过 Loader 转换文件，通过 Plugin 注入钩子，最后输出由多个模块组合成的文件。Webpack 专注于构建模块化项目。

其官网的首页图很形象的画出了 Webpack 是什么

![](/images/assets/20200727154553214.png)
一切文件：JavaScript、CSS、SCSS、图片、模板，在 Webpack 眼中都是一个个模块，这样的好处是能清晰的描述出各个模块之间的依赖关系，以方便 Webpack 对模块进行组合和打包。 经过 Webpack 的处理，最终会输出浏览器能使用的静态资源。

Webpack的优点是：

- 专注于处理模块化的项目，能做到开箱即用一步到位；
- 通过 Plugin 扩展，完整好用又不失灵活；
- 使用场景不仅限于 Web 开发；
- 社区庞大活跃，经常引入紧跟时代发展的新特性，能为大多数场景找到已有的开源扩展；
良好的开发体验。

<!-- more -->

Webpack的缺点是只能用于采用模块化开发的项目。

# 入门
## webpack安装
在安装 Webpack 前请确保你的系统安装了5.0.0及以上版本的 Node.js。

### 新建一个项目
在开始给项目加入构建前，你需要先新建一个 Web 项目，方式包括：

- 新建一个目录，再进入项目根目录执行 npm init 来初始化最简单的采用了模块化开发的项目；
- 用脚手架工具 Yeoman 直接快速地生成一个最符合你的需求的项目。
 
### 安装webpack到本地项目

```shell
npm install webpack --save-dev
```
安装完后你可以通过这些途径运行安装到本项目的 Webpack：

- 在项目根目录下对应的命令行里通过 node_modules/.bin/webpack 运行 Webpack 可执行文件。
- 在 Npm Script 里定义的任务会优先使用本项目下的 Webpack，代码如下：

```json
"scripts": {
    "start": "webpack --config webpack.config.js"
}
```
### 安装webpack到全局

```shell
npm install webpack webpack-cli --save-dev-g
```
虽然介绍了以上两种安装方式，但是我们**推荐安装到本项目**，原因是可防止不同项目依赖不同版本的 Webpack 而导致冲突。

### 一个简单的示例
下面通过 Webpack 构建一个采用 CommonJS 模块化编写的项目，该项目有个网页会通过 JavaScript 在网页中显示 Hello,Webpack。

首先我们按照上文步骤新建项目文件夹，并在该项目下安装webpack。

然后要完成该功能的最基础的 JavaScript 文件和 HTML 建立好，需要如下文件：

页面入口文件 index.html

```html
<html>
<head>
  <meta charset="UTF-8">
</head>
<body>
<div id="app"></div>
<!--导入 Webpack 输出的 JavaScript 文件-->
<script src="./dist/bundle.js"></script>
</body>
</html>
```

JS 工具函数文件 show.js

```javascript
// 操作 DOM 元素，把 content 显示到网页上
function show(content) {
  window.document.getElementById('app').innerText = 'Hello,' + content;
}

// 通过 CommonJS 规范导出 show 函数
module.exports = show;
```

JS 执行入口文件 main.js

```javascript
// 通过 CommonJS 规范导入 show 函数
const show = require('./show.js');
// 执行 show 函数
show('Webpack');
```

Webpack 在执行构建时默认会从项目根目录下的 webpack.config.js 文件读取配置，所以你还需要新建它，其内容如下：

```javascript
const path = require('path');

module.exports = {
  // JavaScript 执行入口文件
  entry: './main.js',
  output: {
    // 把所有依赖的模块合并输出到一个 bundle.js 文件
    filename: 'bundle.js',
    // 输出文件都放到 dist 目录下
    path: path.resolve(__dirname, './dist'),
  }
};
```

由于 Webpack 构建运行在 Node.js 环境下，所以该文件最后需要通过 CommonJS 规范导出一个描述如何构建的 Object 对象。

此时项目目录如下：

|-- index.html
|-- main.js
|-- show.js
|-- webpack.config.js

一切文件就绪，在项目根目录下执行 webpack 命令运行 Webpack 构建，你会发现目录下多出一个 dist 目录，里面有个 bundle.js 文件， bundle.js 文件是一个可执行的 JavaScript 文件，它包含页面所依赖的两个模块 main.js 和 show.js 及内置的 webpackBootstrap 启动函数。 这时你用浏览器打开 index.html 网页将会看到 Hello,Webpack。

Webpack 是一个打包模块化 JavaScript 的工具，它会从 main.js 出发，识别出源码中的模块化导入语句， **递归**的寻找出入口文件的所有依赖，把入口和其所有依赖打包到一个单独的文件中。 **从 Webpack2 开始，已经内置了对 ES6、CommonJS、AMD 模块化语句的支持**。

## 使用loader
继续上一节的示例，这个时候我们要给hello，webpack这行文字添加样式，我们新建一个文件main.css，然后添加如下样式：

```css
#app {
    text-align: center;
}
```
Webpack 把一切文件看作模块，CSS 文件也不例外，要引入 main.css 需要像引入 JavaScript 文件那样，修改入口文件 main.js 如下：
```javascript
// 通过 CommonJS 规范导入 CSS 模块
require('./main.css');
// 通过 CommonJS 规范导入 show 函数
const show = require('./show.js');
// 执行 show 函数
show('Webpack');
```
如果这个时候直接手写require('./main.css')，Webpack 构建是会报错的，因为 Webpack 不原生支持解析 CSS 文件。要支持非 JavaScript 类型的文件，需要使用 Webpack 的 Loader 机制

```javascript
const path = require('path');

module.exports = {
  // JavaScript 执行入口文件
  entry: './main.js',
  output: {
    // 把所有依赖的模块合并输出到一个 bundle.js 文件
    filename: 'bundle.js',
    // 输出文件都放到 dist 目录下
    path: path.resolve(__dirname, './dist'),
  },
  module: {
    rules: [
      {
        // 用正则去匹配要用该 loader 转换的 CSS 文件
        test: /\.css$/,
        use: ['style-loader', 'css-loader?minimize'],
      }
    ]
  }
};
```
Loader 可以看作具有文件转换功能的翻译员，配置里的 module.rules 数组配置了一组规则，告诉 Webpack 在遇到哪些文件时使用哪些 Loader 去加载和转换。 如上配置告诉 Webpack 在遇到以 .css 结尾的文件时先使用 css-loader 读取 CSS 文件，再交给 style-loader 把 CSS 内容注入到 JavaScript 里。 在配置 Loader 时需要注意的是：

- use 属性的值需要是一个由 Loader 名称组成的数组，Loader 的执行顺序是由后到前的；
- 每一个 Loader 都可以通过 URL querystring 的方式传入参数，例如 css-loader?minimize 中的 minimize 告诉 css-loader 要开启 CSS 压缩。
- 想知道 Loader 具体支持哪些属性，则需要我们查阅文档，例如 css-loader 还有很多用法，我们可以在 [css-loader](https://github.com/webpack-contrib/css-loader) 主页 上查到。

**在重新执行 Webpack 构建前要先安装新引入的 Loader：**

```shell
npm install style-loader css-loader --save-dev
```
安装成功后重新执行构建时，你会发现 bundle.js 文件被更新了，里面**注入了在 main.css 中写的 CSS，而不是会额外生成一个 CSS 文件**。 但是重新刷新 index.html 网页时将会发现 Hello,Webpack 居中了，样式生效了！ 也许你会对此感到奇怪，第一次看到 CSS 被写在了 JavaScript 里！这其实都是 style-loader 的功劳，它的工作原理大概是把 CSS 内容用 JavaScript 里的字符串存储起来， 在网页执行 JavaScript 时通过 DOM 操作动态地往 HTML head 标签里插入 HTML style 标签。 也许你认为这样做会导致 JavaScript 文件变大并导致加载网页时间变长，想让 Webpack 单独输出 CSS 文件。下一节使用Plugin 将教你如何通过 Webpack Plugin 机制来实现。

给 Loader 传入属性的方式除了有 querystring 外，还可以通过 Object 传入，以上的 Loader 配置可以修改为如下：

```javascript
use: [
  'style-loader', 
  {
    loader:'css-loader',
    options:{
      minimize:true,
    }
  }
]
```

除了在 webpack.config.js 配置文件中配置 Loader 外，还可以在源码中指定用什么 Loader 去处理文件。 以加载 CSS 文件为例，修改上面例子中的 main.js 如下：

```javascript
require('style-loader!css-loader!./main.css');
```

这样就能指定对 ./main.css 这个文件先采用 css-loader 再采用 style-loader 转换。

## 使用plugin
Plugin 是用来扩展 Webpack 功能的，通过在构建流程里注入钩子实现，它给 Webpack 带来了很大的灵活性。

在上一节中通过 Loader 加载了 CSS 文件，本节将通过 Plugin 把注入到 bundle.js 文件里的 CSS 提取到单独的文件中，配置修改如下：

```javascript
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  // JavaScript 执行入口文件
  entry: './main.js',
  output: {
    // 把所有依赖的模块合并输出到一个 bundle.js 文件
    filename: 'bundle.js',
    // 把输出文件都放到 dist 目录下
    path: path.resolve(__dirname, './dist'),
  },
  module: {
    rules: [
      {
        // 用正则去匹配要用该 loader 转换的 CSS 文件
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          // 转换 .css 文件需要使用的 Loader
          use: ['css-loader'],
        }),
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      // 从 .js 文件中提取出来的 .css 文件的名称
      filename: `[name]_[contenthash:8].css`,
    }),
  ]
};
```
同样的，在执行构建之前需要安装extract-text-webpack-plugin这个插件

> 需要注意的是，截止2020年7月27日，webpack已经到4.44版本，但是extract-text-webpack-plugin稳定版本依然不支持webpack4以上的版本，因此需要安装下一代版本

```shell
npm install extract-text-webpack-plugin@next --save-dev
```

但是官方文档建议使用另外一个插件：[mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin)

## 使用DevServer
 DevServer 会启动一个 HTTP 服务器用于服务网页请求，同时会帮助启动 Webpack ，并接收 Webpack 发出的文件更变信号，通过 WebSocket 协议自动刷新网页做到实时预览。

下面为之前的小项目 Hello,Webpack 继续集成 DevServer。 首先需要安装 DevServer：

```shell
npm i -D webpack-dev-server
```
安装成功后执行 webpack-dev-server 命令
可以修改package.json文件使用npm启动：

```javascript
"scripts": {
  "watch": "webpack --watch",
  "build": "webpack --config webpack.config.js",
  "start": "webpack-dev-server --open"
},
```

这时你会看到控制台有一串日志输出：

```shell
Project is running at http://localhost:8080/
webpack output is served from /
```

> 注意：为避免出现意外错误，需要格外注意各个依赖的版本兼容性。截止2020年7月28日，可正确运行的依赖版本如下：

```json
"webpack": "^4.44.0",
"webpack-dev-server": "3.7.1",
"webpack-cli": "3.3.4"
```

这意味着 DevServer 启动的 HTTP 服务器监听在 http://localhost:8080/ ，DevServer 启动后会一直驻留在后台保持运行，访问这个网址你就能获取项目根目录下的 index.html。 用浏览器打开这个地址你会发现页面空白错误原因是 ./dist/bundle.js 加载404了。 同时你会发现并没有文件输出到 dist 目录，原因是 DevServer 会把 Webpack 构建出的文件保存在内存中，在要访问输出的文件时，必须通过 HTTP 服务访问。 由于 DevServer 不会理会 webpack.config.js 里配置的 output.path 属性，所以要获取 bundle.js 的正确 URL 是 http://localhost:8080/bundle.js，对应的 index.html 应该修改为：

```html
<html>
	<head>
	  <meta charset="UTF-8">
	</head>
	<body>
		<div id="app"></div>
		<!--导入 DevServer 输出的 JavaScript 文件-->
		<script src="bundle.js"></script>
	</body>
</html>
```


### 实时预览
接着上面的步骤，你可以试试修改 main.js main.css show.js 中的任何一个文件，保存后你会发现浏览器会被自动刷新，运行出修改后的效果。

Webpack 在启动时可以开启监听模式，开启监听模式后 Webpack 会监听本地文件系统的变化，发生变化时重新构建出新的结果。Webpack 默认是关闭监听模式的，你可以在启动 **Webpack 时通过 webpack --watch** 来开启监听模式。

**通过 DevServer 启动的 Webpack 会开启监听模式**，当发生变化时重新执行完构建后通知 DevServer。 DevServer 会让 Webpack 在构建出的 JavaScript 代码里注入一个代理客户端用于控制网页，网页和 DevServer 之间通过 WebSocket 协议通信， 以方便 DevServer 主动向客户端发送命令。 DevServer 在收到来自 Webpack 的文件变化通知时通过注入的客户端控制网页刷新。

如果尝试修改 index.html 文件并保存，你会发现这并不会触发以上机制，导致这个问题的原因是 Webpack 在启动时会以配置里的 entry 为入口去递归解析出 entry 所依赖的文件，只有 entry 本身和依赖的文件才会被 Webpack 添加到监听列表里。 而 **index.html 文件是脱离了 JavaScript 模块化系统的**，所以 Webpack 不知道它的存在。

### 模块热替换
除了通过重新刷新整个网页来实现实时预览，DevServer 还有一种被称作模块热替换的刷新技术。 模块热替换能做到在不重新加载整个网页的情况下，通过将被更新过的模块替换老的模块，再重新执行一次来实现实时预览。 模块热替换相对于默认的刷新机制能提供更快的响应和更好的开发体验。 模块热替换默认是关闭的，要开启模块热替换，你只需在启动 DevServer 时带上 --hot 参数，重启 DevServer 后再去更新文件就能体验到模块热替换的神奇了。

### 支持 Source Map
在浏览器中运行的 JavaScript 代码都是编译器输出的代码，这些代码的可读性很差。如果在开发过程中遇到一个不知道原因的 Bug，则你可能需要通过断点调试去找出问题。 在编译器输出的代码上进行断点调试是一件辛苦和不优雅的事情。

例如，我在show.js里面随便写了一个bug：
![](/images/assets/20200728181520583.png)
当我们到控制台调试时，就会发现这个尴尬的情况：
![](/images/assets/20200728181641439.png)

![](/images/assets/20200728181604443.png)
可以看到最终浏览器定位到了编译输出的文件，在体量比较庞大的项目中，想要依靠这个调试信息定位到源文件的具体出错的地方，可以说是非常困难的，此时我们就需要一些工具。

调试工具可以通过 Source Map 映射代码，让你在源代码上断点调试。 Webpack 支持生成 Source Map，只需在启动时带上 --devtool source-map 参数。 加上参数重启 DevServer 后刷新页面，再打开 Chrome 浏览器的开发者工具，就可在 Sources 栏中看到可调试的源代码了。

这个时候再来看：
![](/images/assets/20200728182036694.png)
完美！！！

> webpack-dev-server启动在线调试会自动开启Source Map

## 核心概念
 Webpack 有以下几个核心概念。

- Entry：入口，Webpack 执行构建的第一步将从 Entry 开始，可抽象成输入。
- Module：模块，**在 Webpack 里一切皆模块**，一个模块对应着一个文件。Webpack 会从配置的 Entry 开始递归找出所有依赖的模块。
- Chunk：代码块，一个 Chunk 由多个模块组合而成，用于代码合并与分割。
- Loader：模块转换器，用于把模块原内容按照需求转换成新内容。
- Plugin：扩展插件，在 Webpack 构建流程中的特定时机注入扩展逻辑来改变构建结果或做你想要的事情。
- Output：输出结果，在 Webpack 经过一系列处理并得出最终想要的代码后输出结果。
Webpack 启动后会从 Entry 里配置的 Module 开始递归解析 Entry 依赖的所有 Module。 每找到一个 Module， 就会根据配置的 Loader 去找出对应的转换规则，对 Module 进行转换后，再解析出当前 Module 依赖的 Module。 这些模块会以 Entry 为单位进行分组，一个 Entry 和其所有依赖的 Module 被分到一个组也就是一个 Chunk。最后 Webpack 会把所有 Chunk 转换成文件输出。 在整个流程中 Webpack 会在恰当的时机执行 Plugin 里定义的逻辑。

在实际应用中你可能会遇到各种奇怪复杂的场景，不知道从哪开始。 根据以上总结，你会对 Webpack 有一个整体的认识，这能让你在以后使用 Webpack 的过程中快速知道应该通过配置什么去完成你想要的功能，而不是无从下手。