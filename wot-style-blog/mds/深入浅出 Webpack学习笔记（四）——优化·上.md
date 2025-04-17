---
date: 2020-08-03
categories: [技术,前端,webpack]
toc: true
---

了解了webpack的一些基本使用方法，我们就开始需要着手于一些优化点了。 webpack优化可以分为优化开发体验和优化输出质量两部分，那么接下来就深入学习一下webpack的优化。

**优化开发体验**
优化开发体验的目的是为了提升开发时的效率，其中又可以分为以下几点：

1. 优化构建速度。在项目庞大时构建耗时可能会变的很长，每次等待构建的耗时加起来也会是个大数目。
2. 优化使用体验。通过自动化手段完成一些重复的工作，让我们专注于解决问题本身。

**优化输出质量**
优化输出质量的目的是为了给用户呈现体验更好的网页，例如减少首屏加载时间、提升性能流畅度等。 这至关重要，因为在互联网行业竞争日益激烈的今天，这可能关系到你的产品的生死。

优化输出质量本质是优化构建输出的要发布到线上的代码，分为以下几点：

1. 减少用户能感知到的加载时间，也就是首屏加载时间。
2. 提升流畅度，也就是提升代码性能。

优化的关键是找出问题所在，这样才能一针见血， 输出分析 教你如何利用工具快速找出问题所在。

<!-- more -->

# 缩小文件搜索范围
Webpack 启动后会从配置的 Entry 出发，解析出文件中的导入语句，再递归的解析。 在遇到导入语句时 Webpack 会做两件事情：

- 根据导入语句去寻找对应的要导入的文件。例如 require('react') 导入语句对应的文件是 ./node_modules/react/react.js，require('./util') 对应的文件是 ./util.js。
- 根据找到的要导入文件的后缀，使用配置中的 Loader 去处理文件。例如使用 ES6 开发的 JavaScript 文件需要使用 babel-loader 去处理。

以上两件事情虽然对于处理一个文件非常快，但是当项目大了以后文件量会变的非常多，这时候构建速度慢的问题就会暴露出来。 虽然以上两件事情无法避免，但需要尽量减少以上两件事情的发生，以提高速度。

接下来一一介绍可以优化它们的途径。

## 优化 loader 配置
由于 Loader 对文件的转换操作很耗时，需要让尽可能少的文件被 Loader 处理。

在2-3 Module 中介绍过在使用 Loader 时可以通过 test 、 include 、 exclude 三个配置项来命中 Loader 要应用规则的文件。 为了尽可能少的让文件被 Loader 处理，可以通过 include 去命中只有哪些文件需要被处理。

以采用 ES6 的项目为例，在配置 babel-loader 时，可以这样：

```js
module.exports = {
  module: {
    rules: [
      {
        // 如果项目源码中只有 js 文件就不要写成 /\.jsx?$/，提升正则表达式性能
        test: /\.js$/,
        // babel-loader 支持缓存转换出的结果，通过 cacheDirectory 选项开启
        use: ['babel-loader?cacheDirectory'],
        // 只对项目根目录下的 src 目录中的文件采用 babel-loader
        include: path.resolve(__dirname, 'src'),
      },
    ]
  },
};
```

你可以适当的调整项目的目录结构，以方便在配置 Loader 时通过 include 去缩小命中范围。

## 优化 resolve.modules 配置
在2-4 Resolve 中介绍过 resolve.modules 用于配置 Webpack 去哪些目录下寻找第三方模块。

resolve.modules 的默认值是 ['node_modules']，**含义是先去当前目录下的 ./node_modules 目录下去找想找的模块，如果没找到就去上一级目录 ../node_modules 中找，再没有就去 ../../node_modules 中找，以此类推**，这和 Node.js 的模块寻找机制很相似。

当安装的第三方模块都放在项目根目录下的 ./node_modules 目录下时，没有必要按照默认的方式去一层层的寻找，可以指明存放第三方模块的绝对路径，以减少寻找，配置如下：

```javascript
module.exports = {
  resolve: {
    // 使用绝对路径指明第三方模块存放的位置，以减少搜索步骤
    // 其中 __dirname 表示当前工作目录，也就是项目根目录
    // modules: ['node_modules']
    modules: [path.resolve(__dirname, 'node_modules')]
  },
};
```

## 优化 resolve.mainFields 配置
在2-4 Resolve 中介绍过 resolve.mainFields 用于配置第三方模块使用哪个入口文件。

安装的第三方模块中都会有一个 package.json 文件用于描述这个模块的属性，其中有些字段用于描述入口文件在哪里，resolve.mainFields 用于配置采用哪个字段作为入口文件的描述。

可以存在多个字段描述入口文件的原因是因为有些模块可以同时用在多个环境中，针对不同的运行环境需要使用不同的代码。 以 isomorphic-fetch 为例，它是 fetch API 的一个实现，但可同时用于浏览器和 Node.js 环境。 它的 package.json 中就有2个入口文件描述字段：

```json
{
  "browser": "fetch-npm-browserify.js",
  "main": "fetch-npm-node.js"
}
```

isomorphic-fetch 在不同的运行环境下使用不同的代码是因为 fetch API 的实现机制不一样，在浏览器中通过原生的 fetch 或者 XMLHttpRequest 实现，在 Node.js 中通过 http 模块实现。

resolve.mainFields 的默认值和当前的 target 配置有关系，对应关系如下：

当 target 为 web 或者 webworker 时，值是 ["browser", "module", "main"]
当 target 为其它情况时，值是 ["module", "main"]
以 target 等于 web 为例，Webpack 会先采用第三方模块中的 browser 字段去寻找模块的入口文件，如果不存在就采用 module 字段，以此类推。

为了减少搜索步骤，在你明确第三方模块的入口文件描述字段时，你可以把它设置的尽量少。 由于大多数第三方模块都采用 main 字段去描述入口文件的位置，可以这样配置 Webpack：

```javascript
module.exports = {
  resolve: {
    // 只采用 main 字段作为入口文件描述字段，以减少搜索步骤
    mainFields: ['main'],
  },
};
```

使用本方法优化时，**你需要考虑到所有运行时依赖的第三方模块的入口文件描述字段，就算有一个模块搞错了都可能会造成构建出的代码无法正常运行。**

## 优化 resolve.alias 配置
在2-4 Resolve 中介绍过 resolve.alias 配置项通过别名来把原导入路径映射成一个新的导入路径。

在实战项目中经常会依赖一些庞大的第三方模块，以 React 库为例，安装到 node_modules 目录下的 React 库的目录结构如下：

├── dist
│   ├── react.js
│   └── react.min.js
├── lib
│   ... 还有几十个文件被忽略
│   ├── LinkedStateMixin.js
│   ├── createClass.js
│   └── React.js
├── package.json
└── react.js
可以看到发布出去的 React 库中包含两套代码：

一套是采用 CommonJS 规范的模块化代码，这些文件都放在 lib 目录下，以 package.json 中指定的入口文件 react.js 为模块的入口。
一套是把 React 所有相关的代码打包好的完整代码放到一个单独的文件中，这些代码没有采用模块化可以直接执行。其中 dist/react.js 是用于开发环境，里面包含检查和警告的代码。dist/react.min.js 是用于线上环境，被最小化了。
默认情况下 Webpack 会从入口文件 ./node_modules/react/react.js 开始递归的解析和处理依赖的几十个文件，这会时一个耗时的操作。 通过配置 resolve.alias 可以让 Webpack 在处理 React 库时，直接使用单独完整的 react.min.js 文件，从而跳过耗时的递归解析操作。

相关 Webpack 配置如下：

module.exports = {

```javascript
  resolve: {
    // 使用 alias 把导入 react 的语句换成直接使用单独完整的 react.min.js 文件，
    // 减少耗时的递归解析操作
    alias: {
      'react': path.resolve(__dirname, './node_modules/react/dist/react.min.js'), // react15
      // 'react': path.resolve(__dirname, './node_modules/react/umd/react.production.min.js'), // react16
    }
  },
};
```

除了 React 库外，大多数库发布到 Npm 仓库中时都会包含打包好的完整文件，对于这些库你也可以对它们配置 alias。

> 但是对于有些库使用本优化方法后会影响到后面要讲的使用 Tree-Shaking去除无效代码的优化，因为打包好的完整文件中有部分代码你的项目可能永远用不上。
> 一般对整体性比较强的库采用本方法优化，因为完整文件中的代码是一个整体，每一行都是不可或缺的。 
> 但是对于一些工具类的库，比如lodash，你的项目可能只用到了其中几个工具函数，你就不能使用本方法去优化，因为这会导致你的输出代码中包含很多永远不会执行的代码。

## 优化 resolve.extensions 配置
在导入语句没带文件后缀时，Webpack 会自动带上后缀后去尝试询问文件是否存在。 在2-4 Resolve 中介绍过 resolve.extensions 用于配置在尝试过程中用到的后缀列表，默认是：

extensions: ['.js', '.json']
也就是说当遇到 require('./data') 这样的导入语句时，Webpack 会先去寻找 ./data.js 文件，如果该文件不存在就去寻找 ./data.json 文件，如果还是找不到就报错。

如果这个列表越长，或者正确的后缀在越后面，就会造成尝试的次数越多，所以 resolve.extensions 的配置也会影响到构建的性能。 在配置 resolve.extensions 时你需要遵守以下几点，以做到尽可能的优化构建性能：

- 后缀尝试列表要尽可能的小，不要把项目中不可能存在的情况写到后缀尝试列表中。
- 频率出现最高的文件后缀要优先放在最前面，以做到尽快的退出寻找过程。
- 在源码中写导入语句时，要尽可能的带上后缀，从而可以避免寻找过程。例如在你确定的情况下把 require('./data') 写成 require('./data.json')。

相关 Webpack 配置如下：

```javascript
module.exports = {
  resolve: {
    // 尽可能的减少后缀尝试的可能性
    extensions: ['js'],
  },
};
```

## 优化 module.noParse 配置
在2-3 Module 中介绍过 module.noParse 配置项可以让 Webpack 忽略对部分没采用模块化的文件的递归解析处理，这样做的好处是能提高构建性能。 原因是一些库，例如 jQuery 、ChartJS， 它们庞大又没有采用模块化标准，让 Webpack 去解析这些文件耗时又没有意义。

在上面的 优化 resolve.alias 配置 中讲到单独完整的 react.min.js 文件就没有采用模块化，让我们来通过配置 module.noParse 忽略对 react.min.js 文件的递归解析处理， 相关 Webpack 配置如下：

```javascript
const path = require('path');

module.exports = {
  module: {
    // 独完整的 `react.min.js` 文件就没有采用模块化，忽略对 `react.min.js` 文件的递归解析处理
    noParse: [/react\.min\.js$/],
  },
};
```

注意被忽略掉的文件里不应该包含 import 、 require 、 define 等模块化语句，不然会导致构建出的代码中包含无法在浏览器环境下执行的模块化语句。

以上就是所有和缩小文件搜索范围相关的构建性能优化了，在根据自己项目的需要去按照以上方法改造后，你的构建速度一定会有所提升。

# 使用 DllPlugin
## 认识 DLL
在介绍 DllPlugin 前先给大家介绍下 DLL。 用过 Windows 系统的人应该会经常看到以 .dll 为后缀的文件，这些文件称为动态链接库，在一个动态链接库中可以包含给其他模块调用的函数和数据。

要给 Web 项目构建接入动态链接库的思想，需要完成以下事情：

把网页依赖的基础模块抽离出来，打包到一个个单独的动态链接库中去。一个动态链接库中可以包含多个模块。
当需要导入的模块存在于某个动态链接库中时，这个模块不能被再次被打包，而是去动态链接库中获取。

页面依赖的所有动态链接库需要被加载。

为什么给 Web 项目构建接入动态链接库的思想后，会大大提升构建速度呢？ 原因在于包含大量复用模块的动态链接库只需要编译一次，在之后的构建过程中被动态链接库包含的模块将不会在重新编译，而是直接使用动态链接库中的代码。 由于动态链接库中大多数包含的是常用的第三方模块，例如 react、react-dom，只要不升级这些模块的版本，动态链接库就不用重新编译。

## 接入 Webpack
Webpack 已经内置了对动态链接库的支持，需要通过2个内置的插件接入，它们分别是：

- DllPlugin 插件：用于打包出一个个单独的动态链接库文件。
- DllReferencePlugin 插件：用于在主要配置文件中去引入 DllPlugin 插件打包好的动态链接库文件。
下面以基本的 React 项目为例，为其接入 DllPlugin，在开始前先来看下最终构建出的目录结构：

├── main.js
├── polyfill.dll.js
├── polyfill.manifest.json
├── react.dll.js
└── react.manifest.json
其中包含两个动态链接库文件，分别是：

polyfill.dll.js 里面包含项目所有依赖的 polyfill，例如 Promise、fetch 等 API。
react.dll.js 里面包含 React 的基础运行环境，也就是 react 和 react-dom 模块。
以 react.dll.js 文件为例，其文件内容大致如下：

```javascript
var _dll_react = (function(modules) {
  // ... 此处省略 webpackBootstrap 函数代码
}([
  function(module, exports, __webpack_require__) {
    // 模块 ID 为 0 的模块对应的代码
  },
  function(module, exports, __webpack_require__) {
    // 模块 ID 为 1 的模块对应的代码
  },
  // ... 此处省略剩下的模块对应的代码 
]));
```

可见一个动态链接库文件中包含了大量模块的代码，这些模块存放在一个数组里，用数组的索引号作为 ID。 并且还通过 _dll_react 变量把自己暴露在了全局中，也就是可以通过 window._dll_react 可以访问到它里面包含的模块。

其中 polyfill.manifest.json 和 react.manifest.json 文件也是由 DllPlugin 生成出，用于描述动态链接库文件中包含哪些模块， 以 react.manifest.json 文件为例，其文件内容大致如下：

```javascript
{
  // 描述该动态链接库文件暴露在全局的变量名称
  "name": "_dll_react",
  "content": {
    "./node_modules/process/browser.js": {
      "id": 0,
      "meta": {}
    },
    // ... 此处省略部分模块
    "./node_modules/react-dom/lib/ReactBrowserEventEmitter.js": {
      "id": 42,
      "meta": {}
    },
    "./node_modules/react/lib/lowPriorityWarning.js": {
      "id": 47,
      "meta": {}
    },
    // ... 此处省略部分模块
    "./node_modules/react-dom/lib/SyntheticTouchEvent.js": {
      "id": 210,
      "meta": {}
    },
    "./node_modules/react-dom/lib/SyntheticTransitionEvent.js": {
      "id": 211,
      "meta": {}
    },
  }
}
```

可见 manifest.json 文件清楚地描述了与其对应的 dll.js 文件中包含了哪些模块，以及每个模块的路径和 ID。

main.js 文件是编译出来的执行入口文件，当遇到其依赖的模块在 dll.js 文件中时，会直接通过 dll.js 文件暴露出的全局变量去获取打包在 dll.js 文件的模块。 所以在 index.html 文件中需要把依赖的两个 dll.js 文件给加载进去，index.html 内容如下：

```html
<html>
<head>
  <meta charset="UTF-8">
</head>
<body>
<div id="app"></div>
<!--导入依赖的动态链接库文件-->
<script src="./dist/polyfill.dll.js"></script>
<script src="./dist/react.dll.js"></script>
<!--导入执行入口文件-->
<script src="./dist/main.js"></script>
</body>
</html>
```

以上就是所有接入 DllPlugin 后最终编译出来的代码，接下来教你如何实现。

## 构建出动态链接库文件
构建输出的以下这四个文件

├── polyfill.dll.js
├── polyfill.manifest.json
├── react.dll.js
└── react.manifest.json
和以下这一个文件

├── main.js
是由两份不同的构建分别输出的。

动态链接库文件相关的文件需要由一份独立的构建输出，用于给主构建使用。新建一个 Webpack 配置文件 webpack_dll.config.js 专门用于构建它们，文件内容如下：

```javascript
const path = require('path');
const DllPlugin = require('webpack/lib/DllPlugin');

module.exports = {
  // JS 执行入口文件
  entry: {
    // 把 React 相关模块的放到一个单独的动态链接库
    react: ['react', 'react-dom'],
    // 把项目需要所有的 polyfill 放到一个单独的动态链接库
    polyfill: ['core-js/fn/object/assign', 'core-js/fn/promise', 'whatwg-fetch'],
  },
  output: {
    // 输出的动态链接库的文件名称，[name] 代表当前动态链接库的名称，
    // 也就是 entry 中配置的 react 和 polyfill
    filename: '[name].dll.js',
    // 输出的文件都放到 dist 目录下
    path: path.resolve(__dirname, 'dist'),
    // 存放动态链接库的全局变量名称，例如对应 react 来说就是 _dll_react
    // 之所以在前面加上 _dll_ 是为了防止全局变量冲突
    library: '_dll_[name]',
  },
  plugins: [
    // 接入 DllPlugin
    new DllPlugin({
      // 动态链接库的全局变量名称，需要和 output.library 中保持一致
      // 该字段的值也就是输出的 manifest.json 文件 中 name 字段的值
      // 例如 react.manifest.json 中就有 "name": "_dll_react"
      name: '_dll_[name]',
      // 描述动态链接库的 manifest.json 文件输出时的文件名称
      path: path.join(__dirname, 'dist', '[name].manifest.json'),
    }),
  ],
};
```

## 使用动态链接库文件
构建出的动态链接库文件用于给其它地方使用，在这里也就是给执行入口使用。

用于输出 main.js 的主 Webpack 配置文件内容如下：

```javascript
const path = require('path');
const DllReferencePlugin = require('webpack/lib/DllReferencePlugin');

module.exports = {
  entry: {
    // 定义入口 Chunk
    main: './main.js'
  },
  output: {
    // 输出文件的名称
    filename: '[name].js',
    // 输出文件都放到 dist 目录下
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        // 项目源码使用了 ES6 和 JSX 语法，需要使用 babel-loader 转换
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: path.resolve(__dirname, 'node_modules'),
      },
    ]
  },
  plugins: [
    // 告诉 Webpack 使用了哪些动态链接库
    new DllReferencePlugin({
      // 描述 react 动态链接库的文件内容
      manifest: require('./dist/react.manifest.json'),
    }),
    new DllReferencePlugin({
      // 描述 polyfill 动态链接库的文件内容
      manifest: require('./dist/polyfill.manifest.json'),
    }),
  ],
  devtool: 'source-map'
};
```

> 注意：在 webpack_dll.config.js 文件中，DllPlugin 中的 name 参数必须和 output.library
> 中保持一致。 原因在于 DllPlugin 中的 name 参数会影响输出的 manifest.json 文件中 name 字段的值， 而在
> webpack.config.js 文件中 DllReferencePlugin 会去 manifest.json 文件读取 name
> 字段的值， 把值的内容作为在从全局变量中获取动态链接库中内容时的全局变量名。

## 执行构建
在修改好以上两个 Webpack 配置文件后，需要重新执行构建。 重新执行构建时要注意的是需要先把动态链接库相关的文件编译出来，因为主 Webpack 配置文件中定义的 DllReferencePlugin 依赖这些文件。

执行构建时流程如下：

- 如果动态链接库相关的文件还没有编译出来，就需要先把它们编译出来。方法是执行 webpack --config webpack_dll.config.js 命令。
- 在确保动态链接库存在时，才能正常的编译出入口执行文件。方法是执行 webpack 命令。这时你会发现构建速度有了非常大的提升。

# 使用 HappyPack
由于有大量文件需要解析和处理，构建是文件读写和计算密集型的操作，特别是当文件数量变多后，Webpack 构建慢的问题会显得严重。 运行在 Node.js 之上的 Webpack 是单线程模型的，也就是说 Webpack 需要处理的任务需要一件件挨着做，不能多个事情一起做。

文件读写和计算操作是无法避免的，那能不能让 Webpack 同一时刻处理多个任务，发挥多核 CPU 电脑的威力，以提升构建速度呢？

HappyPack 就能让 Webpack 做到这点，它把任务分解给多个子进程去并发的执行，子进程处理完后再把结果发送给主进程。

由于 JavaScript 是单线程模型，要想发挥多核 CPU 的能力，只能通过多进程去实现，而无法通过多线程实现。

## 使用 HappyPack
分解任务和管理线程的事情 HappyPack 都会帮你做好，你所需要做的只是接入 HappyPack。 接入 HappyPack 的相关代码如下：

```javascript
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HappyPack = require('happypack');

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        // 把对 .js 文件的处理转交给 id 为 babel 的 HappyPack 实例
        use: ['happypack/loader?id=babel'],
        // 排除 node_modules 目录下的文件，node_modules 目录下的文件都是采用的 ES5 语法，没必要再通过 Babel 去转换
        exclude: path.resolve(__dirname, 'node_modules'),
      },
      {
        // 把对 .css 文件的处理转交给 id 为 css 的 HappyPack 实例
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: ['happypack/loader?id=css'],
        }),
      },
    ]
  },
  plugins: [
    new HappyPack({
      // 用唯一的标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件
      id: 'babel',
      // 如何处理 .js 文件，用法和 Loader 配置中一样
      loaders: ['babel-loader?cacheDirectory'],
      // ... 其它配置项
    }),
    new HappyPack({
      id: 'css',
      // 如何处理 .css 文件，用法和 Loader 配置中一样
      loaders: ['css-loader'],
    }),
    new ExtractTextPlugin({
      filename: `[name].css`,
    }),
  ],
};
```

以上代码有两点重要的修改：

- 在 Loader 配置中，所有文件的处理都交给了 happypack/loader 去处理，使用紧跟其后的 querystring ?id=babel 去告诉 happypack/loader 去选择哪个 HappyPack 实例去处理文件。
- 在 Plugin 配置中，新增了两个 HappyPack 实例分别用于告诉 happypack/loader 去如何处理 .js 和 .css 文件。选项中的 id 属性的值和上面 querystring 中的 ?id=babel 相对应，选项中的 loaders 属性和 Loader 配置中一样。

在实例化 HappyPack 插件的时候，除了可以传入 id 和 loaders 两个参数外，HappyPack 还支持如下参数：

- threads 代表开启几个子进程去处理这一类型的文件，默认是3个，类型必须是整数。
- verbose 是否允许 HappyPack 输出日志，默认是 true。
- threadPool 代表共享进程池，即多个 HappyPack 实例都使用同一个共享进程池中的子进程去处理任务，以防止资源占用过多，相关代码如下：

```javascript
const HappyPack = require('happypack');
// 构造出共享进程池，进程池中包含5个子进程
const happyThreadPool = HappyPack.ThreadPool({ size: 5 });

module.exports = {
  plugins: [
    new HappyPack({
      // 用唯一的标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件
      id: 'babel',
      // 如何处理 .js 文件，用法和 Loader 配置中一样
      loaders: ['babel-loader?cacheDirectory'],
      // 使用共享进程池中的子进程去处理任务
      threadPool: happyThreadPool,
    }),
    new HappyPack({
      id: 'css',
      // 如何处理 .css 文件，用法和 Loader 配置中一样
      loaders: ['css-loader'],
      // 使用共享进程池中的子进程去处理任务
      threadPool: happyThreadPool,
    }),
    new ExtractTextPlugin({
      filename: `[name].css`,
    }),
  ],
};
```

接入 HappyPack 后，你需要给项目安装新的依赖：

```shell
npm i -D happypack
```

安装成功后重新执行构建你就会看到以下由 HappyPack 输出的日志：

```shell
Happy[babel]: Version: 4.0.0-beta.5. Threads: 3
Happy[babel]: All set; signaling webpack to proceed.
Happy[css]: Version: 4.0.0-beta.5. Threads: 3
Happy[css]: All set; signaling webpack to proceed.
```

说明你的 HappyPack 配置生效了，并且可以得知 HappyPack 分别启动了3个子进程去并行的处理任务。

## HappyPack 原理
- 在整个 Webpack 构建流程中，最耗时的流程可能就是 Loader 对文件的转换操作了，因为要转换的文件数据巨多，而且这些转换操作都只能一个个挨着处理。 HappyPack 的核心原理就是把这部分任务分解到多个进程去并行处理，从而减少了总的构建时间。

- 从前面的使用中可以看出所有需要通过 Loader 处理的文件都先交给了 happypack/loader 去处理，收集到了这些文件的处理权后 HappyPack 就好统一分配了。

- 每通过 new HappyPack() 实例化一个 HappyPack 其实就是告诉 HappyPack 核心调度器如何通过一系列 Loader 去转换一类文件，并且可以指定如何给这类转换操作分配子进程。

- 核心调度器的逻辑代码在主进程中，也就是运行着 Webpack 的进程中，核心调度器会把一个个任务分配给当前空闲的子进程，子进程处理完毕后把结果发送给核心调度器，它们之间的数据交换是通过进程间通信 API 实现的。

- 核心调度器收到来自子进程处理完毕的结果后会通知 Webpack 该文件处理完毕。

# 压缩代码
浏览器从服务器访问网页时获取的 JavaScript、CSS 资源都是文本形式的，文件越大网页加载时间越长。 为了提升网页加速速度和减少网络传输流量，可以对这些资源进行压缩。 压缩的方法除了可以通过 GZIP 算法对文件压缩外，还可以对文本本身进行压缩。

对文本本身进行压缩的作用除了有提升网页加载速度的优势外，还具有混淆源码的作用。 由于压缩后的代码可读性非常差，就算别人下载到了网页的代码，也大大增加了代码分析和改造的难度。

下面来一一介绍如何在 Webpack 中压缩代码。

## 压缩 JavaScript
目前最成熟的 JavaScript 代码压缩工具是 UglifyJS ， 它会分析 JavaScript 代码语法树，理解代码含义，从而能做到诸如去掉无效代码、去掉日志输出代码、缩短变量名等优化。

要在 Webpack 中接入 UglifyJS 需要通过插件的形式，目前有两个成熟的插件，分别是：

- UglifyJsPlugin：通过封装 UglifyJS 实现压缩。
- ParallelUglifyPlugin：多进程并行处理压缩，下一节有介绍

由于 ParallelUglifyPlugin 在 4-4使用ParallelUglifyPlugin 中介绍就不再复述， 这里重点介绍如何配置 UglifyJS 以达到最优的压缩效果。

UglifyJS 提供了非常多的选择用于配置在压缩过程中采用哪些规则，所有的选项说明可以在 其官方文档 上看到。 由于选项非常多，就挑出一些常用的拿出来详细讲解其应用方式：

- sourceMap：是否为压缩后的代码生成对应的 Source Map，默认为不生成，开启后耗时会大大增加。一般不会把压缩后的代码的 Source Map 发送给网站用户的浏览器，而是用于内部开发人员调试线上代码时使用。
- beautify： 是否输出可读性较强的代码，即会保留空格和制表符，默认为是，为了达到更好的压缩效果，可以设置为 false。
- comments：是否保留代码中的注释，默认为保留，为了达到更好的压缩效果，可以设置为 false。
- compress.warnings：是否在 UglifyJs 删除没有用到的代码时输出警告信息，默认为输出，可以设置为 false 以关闭这些作用不大的警告。
- drop_console：是否剔除代码中所有的 console 语句，默认为不剔除。开启后不仅可以提升代码压缩效果，也可以兼容不支持 console 语句 IE 浏览器。
- collapse_vars：是否内嵌定义了但是只用到一次的变量，例如把 var x = 5; y = x 转换成 y = 5，默认为不转换。为了达到更好的压缩效果，可以设置为 true。
- reduce_vars： 是否提取出出现多次但是没有定义成变量去引用的静态值，例如把 x = 'Hello'; y = 'Hello' 转换成 var a = 'Hello'; x = a; y = b，默认为不转换。为了达到更好的压缩效果，可以设置为 true。

也就是说，在不影响代码正确执行的前提下，最优化的代码压缩配置为如下：

```javascript
const UglifyJSPlugin = require('webpack/lib/optimize/UglifyJsPlugin');

module.exports = {
  plugins: [
    // 压缩输出的 JS 代码
    new UglifyJSPlugin({
      compress: {
        // 在UglifyJs删除没有用到的代码时不输出警告
        warnings: false,
        // 删除所有的 `console` 语句，可以兼容ie浏览器
        drop_console: true,
        // 内嵌定义了但是只用到一次的变量
        collapse_vars: true,
        // 提取出出现多次但是没有定义成变量去引用的静态值
        reduce_vars: true,
      },
      output: {
        // 最紧凑的输出
        beautify: false,
        // 删除所有的注释
        comments: false,
      }
    }),
  ],
};
```

从以上配置中可以看出 Webpack 内置了 UglifyJsPlugin，需要指出的是 UglifyJsPlugin 当前采用的是 UglifyJS2 而不是老的 UglifyJS1， 这两个版本的 UglifyJS 在配置上有所区别，看文档时注意版本。

除此之外 Webpack 还提供了一个更简便的方法来接入 UglifyJSPlugin，直接在启动 Webpack 时带上 --optimize-minimize 参数，即 webpack --optimize-minimize， 这样 Webpack 会自动为你注入一个带有默认配置的 UglifyJSPlugin。

## 压缩 ES6
虽然当前大多数 JavaScript 引擎还不完全支持 ES6 中的新特性，但在一些特定的运行环境下已经可以直接执行 ES6 代码了，例如最新版的 Chrome、ReactNative 的引擎 JavaScriptCore。

运行 ES6 的代码相比于转换后的 ES5 代码有如下优点：

- 一样的逻辑用 ES6 实现的代码量比 ES5 更少。
- JavaScript 引擎对 ES6 中的语法做了性能优化，例如针对 const 申明的变量有更快的读取速度。

所以在运行环境允许的情况下，我们要尽可能的使用原生的 ES6 代码去运行，而不是转换后的 ES5 代码。

在你用上面所讲的压缩方法去压缩 ES6 代码时，你会发现 UglifyJS 会报错退出，原因是 **UglifyJS 只认识 ES5 语法的代码。 为了压缩 ES6 代码，需要使用专门针对 ES6 代码的 UglifyES。**

UglifyES 和 UglifyJS 来自同一个项目的不同分支，它们的配置项基本相同，只是接入 Webpack 时有所区别。 **在给 Webpack 接入 UglifyES 时，不能使用内置的 UglifyJsPlugin，而是需要单独安装和使用最新版本的 uglifyjs-webpack-plugin**。 安装方法如下：

```shell
npm i -D uglifyjs-webpack-plugin@beta
```

Webpack 相关配置代码如下：

```javascript
const UglifyESPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  plugins: [
    new UglifyESPlugin({
      // 多嵌套了一层
      uglifyOptions: {
        compress: {
          // 在UglifyJs删除没有用到的代码时不输出警告
          warnings: false,
          // 删除所有的 `console` 语句，可以兼容ie浏览器
          drop_console: true,
          // 内嵌定义了但是只用到一次的变量
          collapse_vars: true,
          // 提取出出现多次但是没有定义成变量去引用的静态值
          reduce_vars: true,
        },
        output: {
          // 最紧凑的输出
          beautify: false,
          // 删除所有的注释
          comments: false,
        }
      }
    })
  ]
}
```

同时，为了不让 babel-loader 输出 ES5 语法的代码，需要去掉 .babelrc 配置文件中的 babel-preset-env，但是其它的 Babel 插件，比如 babel-preset-react 还是要保留， 因为正是 babel-preset-env 负责把 ES6 代码转换为 ES5 代码。

## 压缩 CSS
CSS 代码也可以像 JavaScript 那样被压缩，以达到提升加载速度和代码混淆的作用。 目前比较成熟可靠的 CSS 压缩工具是 cssnano，基于 PostCSS。

cssnano 能理解 CSS 代码的含义，而不仅仅是删掉空格，例如：

- margin: 10px 20px 10px 20px 被压缩成 margin: 10px 20px
- color: #ff0000 被压缩成 color:red

还有很多压缩规则可以去其官网查看，通常压缩率能达到 60%。

把 cssnano 接入到 Webpack 中也非常简单，**因为 css-loader 已经将其内置了**，要开启 cssnano 去压缩代码只需要开启 css-loader 的 minimize 选项。 相关 Webpack 配置如下：

```javascript
const path = require('path');
const {WebPlugin} = require('web-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,// 增加对 CSS 文件的支持
        // 提取出 Chunk 中的 CSS 代码到单独的文件中
        use: ExtractTextPlugin.extract({
          // 通过 minimize 选项压缩 CSS 代码
          use: ['css-loader?minimize']
        }),
      },
    ]
  },
  plugins: [
    // 用 WebPlugin 生成对应的 HTML 文件
    new WebPlugin({
      template: './template.html', // HTML 模版文件所在的文件路径
      filename: 'index.html' // 输出的 HTML 的文件名称
    }),
    new ExtractTextPlugin({
      filename: `[name]_[contenthash:8].css`,// 给输出的 CSS 文件名称加上 Hash 值
    }),
  ],
};
```

# 使用 ParallelUglifyPlugin

在使用 Webpack 构建出用于发布到线上的代码时，都会有压缩代码这一流程。 最常见的 JavaScript 代码压缩工具是 UglifyJS，并且 Webpack 也内置了它。

用过 UglifyJS 的你一定会发现在构建用于开发环境的代码时很快就能完成，但在构建用于线上的代码时构建一直卡在一个时间点迟迟没有反应，其实卡住的这个时候就是在进行代码压缩。

由于压缩 JavaScript 代码需要先把代码解析成用 Object 抽象表示的 AST 语法树，再去应用各种规则分析和处理 AST，导致这个过程计算量巨大，耗时非常多。

为什么不把在4-3 使用 HappyPack中介绍过的多进程并行处理的思想也引入到代码压缩中呢？

ParallelUglifyPlugin 就做了这个事情。 当 Webpack 有多个 JavaScript 文件需要输出和压缩时，原本会使用 UglifyJS 去一个个挨着压缩再输出， 但是 ParallelUglifyPlugin 则会开启多个子进程，把对多个文件的压缩工作分配给多个子进程去完成，每个子进程其实还是通过 UglifyJS 去压缩代码，但是变成了并行执行。 所以 ParallelUglifyPlugin 能更快的完成对多个文件的压缩工作。

使用 ParallelUglifyPlugin 也非常简单，把原来 Webpack 配置文件中内置的 UglifyJsPlugin 去掉后，再替换成 ParallelUglifyPlugin，相关代码如下：

```javascript
const path = require('path');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');

module.exports = {
  plugins: [
    // 使用 ParallelUglifyPlugin 并行压缩输出的 JS 代码
    new ParallelUglifyPlugin({
      // 传递给 UglifyJS 的参数
      uglifyJS: {
        output: {
          // 最紧凑的输出
          beautify: false,
          // 删除所有的注释
          comments: false,
        },
        compress: {
          // 在UglifyJs删除没有用到的代码时不输出警告
          warnings: false,
          // 删除所有的 `console` 语句，可以兼容ie浏览器
          drop_console: true,
          // 内嵌定义了但是只用到一次的变量
          collapse_vars: true,
          // 提取出出现多次但是没有定义成变量去引用的静态值
          reduce_vars: true,
        }
      },
    }),
  ],
};
```

在通过 new ParallelUglifyPlugin() 实例化时，支持以下参数：

- test：使用正则去匹配哪些文件需要被 ParallelUglifyPlugin 压缩，默认是 /.js$/，也就是默认压缩所有的 .js 文件。
- include：使用正则去命中需要被 ParallelUglifyPlugin 压缩的文件。默认为 []。
- exclude：使用正则去命中不需要被 ParallelUglifyPlugin 压缩的文件。默认为 []。
- cacheDir：缓存压缩后的结果，下次遇到一样的输入时直接从缓存中获取压缩后的结果并返回。cacheDir 用于配置缓存存放的目录路径。默认不会缓存，想开启缓存请设置一个目录路径。
- workerCount：开启几个子进程去并发的执行压缩。默认是当前运行电脑的 CPU 核数减去1。
- sourceMap：是否输出 Source Map，这会导致压缩过程变慢。
- uglifyJS：用于压缩 ES5 代码时的配置，Object 类型，直接透传给 UglifyJS 的参数。
- uglifyES：用于压缩 ES6 代码时的配置，Object 类型，直接透传给 UglifyES 的参数。

> 其中的 test、include、exclude 与配置 Loader 时的思想和用法一样。
> 
> UglifyES 是 UglifyJS 的变种，专门用于压缩 ES6 代码，它们两都出自于同一个项目，并且它们两不能同时使用。
> 
> UglifyES 一般用于给比较新的 JavaScript 运行环境压缩代码，例如用于 ReactNative 的代码运行在兼容性较好的JavaScriptCore 引擎中，为了得到更好的性能和尺寸，采用 UglifyES 压缩效果会更好。
> 
> ParallelUglifyPlugin 同时内置了 UglifyJS 和 UglifyES，也就是说ParallelUglifyPlugin 支持并行压缩 ES6 代码。

接入 ParallelUglifyPlugin 后，项目需要安装新的依赖：

```shell
npm i -D webpack-parallel-uglify-plugin
```

安装成功后，重新执行构建你会发现速度变快了许多。如果设置 cacheDir 开启了缓存，在之后的构建中会变的更快。

# 使用自动刷新
在开发阶段，修改源码是不可避免的操作。 对于开发网页来说，要想看到修改后的效果，需要刷新浏览器让其重新运行最新的代码才行。 虽然这相比于开发原生 iOS 和 Android 应用来说要方便很多，因为那需要重新编译这个项目再运行，但我们可以把这个体验优化的更好。 借助自动化的手段，可以把这些重复的操作交给代码去帮我们完成，在监听到本地源码文件发生变化时，自动重新构建出可运行的代码后再控制浏览器刷新。

Webpack 把这些功能都内置了，并且还提供多种方案可选。

## 文件监听
文件监听是在发现源码文件发生变化时，自动重新构建出新的输出文件。

Webpack 官方提供了两大模块，一个是核心的 webpack，一个是在1-6 使用 DevServer 中提到的 webpack-dev-server 扩展模块。 而文件监听功能是 webpack 模块提供的。

在2-7 其它配置项 中曾介绍过 Webpack 支持文件监听相关的配置项如下：

```javascript
module.export = {
  // 只有在开启监听模式时，watchOptions 才有意义
  // 默认为 false，也就是不开启
  watch: true,
  // 监听模式运行时的参数
  // 在开启监听模式时，才有意义
  watchOptions: {
    // 不监听的文件或文件夹，支持正则匹配
    // 默认为空
    ignored: /node_modules/,
    // 监听到变化发生后会等300ms再去执行动作，防止文件更新太快导致重新编译频率太高
    // 默认为 300ms
    aggregateTimeout: 300,
    // 判断文件是否发生变化是通过不停的去询问系统指定文件有没有变化实现的
    // 默认每隔1000毫秒询问一次
    poll: 1000
  }
}
```

要让 Webpack 开启监听模式，有两种方式：

- 在配置文件 webpack.config.js 中设置 watch: true。
- 在执行启动 Webpack 命令时，带上 --watch 参数，完整命令是 webpack --watch。

## 文件监听工作原理
在 Webpack 中监听一个文件发生变化的原理是**定时的去获取这个文件的最后编辑时间，每次都存下最新的最后编辑时间，如果发现当前获取的和最后一次保存的最后编辑时间不一致，就认为该文件发生了变化**。 配置项中的 watchOptions.poll 就是用于控制定时检查的周期，具体含义是每隔多少毫秒检查一次。

当发现某个文件发生了变化时，并不会立刻告诉监听者，而是先缓存起来，收集一段时间的变化后，再一次性告诉监听者。 配置项中的 watchOptions.aggregateTimeout 就是用于配置这个等待时间。 这样做的目的是因为我们在编辑代码的过程中可能会高频的输入文字导致文件变化的事件高频的发生，如果每次都重新执行构建就会让构建卡死。

对于多个文件来说，原理相似，只不过会对列表中的每一个文件都定时的执行检查。 但是这个需要监听的文件列表是怎么确定的呢？ 默认情况下 **Webpack 会从配置的 Entry 文件出发，递归解析出 Entry 文件所依赖的文件，把这些依赖的文件都加入到监听列表中去**。 可见 Webpack 这一点还是做的很智能的，不是粗暴的直接监听项目目录下的所有文件。

由于保存文件的路径和最后编辑时间需要占用内存，定时检查周期检查需要占用 CPU 以及文件 I/O，所以最好减少需要监听的文件数量和降低检查频率。

## 优化文件监听性能
在明白文件监听工作原理后，就好分析如何优化文件监听性能了。

开启监听模式时，默认情况下会监听配置的 Entry 文件和所有其递归依赖的文件。 在这些文件中会有很多存在于 node_modules 下，因为如今的 Web 项目会依赖大量的第三方模块。 在大多数情况下我们都不可能去编辑 node_modules 下的文件，而是编辑自己建立的源码文件。 所以一个很大的优化点就是忽略掉 node_modules 下的文件，不监听它们。相关配置如下：

```javascript
module.export = {
  watchOptions: {
    // 不监听的 node_modules 目录下的文件
    ignored: /node_modules/,
  }
}
```

采用这种方法优化后，你的 Webpack 消耗的内存和 CPU 将会大大降低。

> 有时你可能会觉得 node_modules 目录下的第三方模块有 bug，想修改第三方模块的文件，然后在自己的项目中试试。在这种情况下如果使用了以上优化方法，我们需要重启构建以看到最新效果。 但这种情况毕竟是非常少见的。

除了忽略掉部分文件的优化外，还有如下两种方法：

- watchOptions.aggregateTimeout 值越大性能越好，因为这能降低重新构建的频率。
- watchOptions.poll 值越大越好，因为这能降低检查的频率。

**但两种优化方法的后果是会让你感觉到监听模式的反应和灵敏度降低了。**

## 自动刷新浏览器
监听到文件更新后的下一步是去刷新浏览器，webpack 模块负责监听文件，webpack-dev-server 模块则负责刷新浏览器。 在使用 **webpack-dev-server 模块去启动 webpack 模块时，webpack 模块的监听模式默认会被开启**。 webpack 模块会在文件发生变化时告诉 webpack-dev-server 模块。

### 自动刷新的原理
控制浏览器刷新有三种方法：

1. 借助浏览器扩展去通过浏览器提供的接口刷新，WebStorm IDE 的 LiveEdit 功能就是这样实现的。
2. 往要开发的网页中注入代理客户端代码，通过代理客户端去刷新整个页面。
3. 把要开发的网页装进一个 iframe 中，通过刷新 iframe 去看到最新效果。

DevServer 支持第2、3种方法，第2种是 DevServer 默认采用的刷新方法。

通过 DevServer 启动构建后，你会看到如下日志：

```shell
> webpack-dev-server

Project is running at http://localhost:8080/
webpack output is served from /
Hash: e4e2f9508ac286037e71
Version: webpack 3.5.5
Time: 1566ms
        Asset     Size  Chunks                    Chunk Names
    bundle.js  1.07 MB       0  [emitted]  [big]  main
bundle.js.map  1.27 MB       0  [emitted]         main
 [115] multi (webpack)-dev-server/client?http://localhost:8080 ./main.js 40 bytes {0} [built]
 [116] (webpack)-dev-server/client?http://localhost:8080 5.83 kB {0} [built]
 [117] ./node_modules/url/url.js 23.3 kB {0} [built]
 [120] ./node_modules/querystring-es3/index.js 127 bytes {0} [built]
 [123] ./node_modules/strip-ansi/index.js 161 bytes {0} [built]
 [125] ./node_modules/loglevel/lib/loglevel.js 6.74 kB {0} [built]
 [126] (webpack)-dev-server/client/socket.js 856 bytes {0} [built]
 [158] (webpack)-dev-server/client/overlay.js 3.6 kB {0} [built]
 [159] ./node_modules/ansi-html/index.js 4.26 kB {0} [built]
 [163] (webpack)/hot nonrecursive ^\.\/log$ 170 bytes {0} [built]
 [165] (webpack)/hot/emitter.js 77 bytes {0} [built]
 [167] ./main.js 2.28 kB {0} [built]
    + 255 hidden modules
```

细心的你会观察到输出的 bundle.js 中包含了以下七个模块：

```shell
 [116] (webpack)-dev-server/client?http://localhost:8080 5.83 kB {0} [built]
 [117] ./node_modules/url/url.js 23.3 kB {0} [built]
 [120] ./node_modules/querystring-es3/index.js 127 bytes {0} [built]
 [123] ./node_modules/strip-ansi/index.js 161 bytes {0} [built]
 [125] ./node_modules/loglevel/lib/loglevel.js 6.74 kB {0} [built] 
 [126] (webpack)-dev-server/client/socket.js 856 bytes {0} [built]
 [158] (webpack)-dev-server/client/overlay.js 3.6 kB {0} [built]
```

这七个模块就是代理客户端的代码，它们被打包进了要开发的网页代码中。

在浏览器中打开网址 http://localhost:8080/ 后， 在浏览器的开发者工具中你会发现由代理客户端向 DevServer 发起的 **WebSocket 连接**：

![](/images/assets/20200803160126575.png)

### 优化自动刷新的性能
在2-6 DevServer中曾介绍过 devServer.inline 配置项，它就是用来控制是否往 Chunk 中注入代理客户端的，默认会注入。 事实上，在开启 inline 时，DevServer 会为每个输出的 Chunk 中注入代理客户端的代码，当你的项目需要输出的 Chunk 有很多个时，这会导致你的构建缓慢。 其实要完成自动刷新，一个页面只需要一个代理客户端就行了，DevServer 之所以粗暴的为每个 Chunk 都注入，是因为它不知道某个网页依赖哪几个 Chunk，索性就全部都注入一个代理客户端。 网页只要依赖了其中任何一个 Chunk，代理客户端就被注入到网页中去。

这里优化的思路是关闭还不够优雅的 inline 模式，只注入一个代理客户端。 为了关闭 inline 模式，在启动 DevServer 时，可通过执行命令 `webpack-dev-server --inline false`（也可以在配置文件中设置），这时输出的日志如下：

```shell
> webpack-dev-server --inline false

Project is running at http://localhost:8080/webpack-dev-server/
webpack output is served from /
Hash: 5a43fc44b5e85f4c2cf1
Version: webpack 3.5.5
Time: 1130ms
        Asset    Size  Chunks                    Chunk Names
    bundle.js  750 kB       0  [emitted]  [big]  main
bundle.js.map  897 kB       0  [emitted]         main
  [81] ./main.js 2.29 kB {0} [built]
    + 169 hidden modules
```

和前面的不同在于

入口网址变成了 http://localhost:8080/webpack-dev-server/
bundle.js 中不再包含代理客户端的代码了
在浏览器中打开网址 http://localhost:8080/webpack-dev-server/ 后，你会看到如下效果：

![](/images/assets/20200803161357730.png)


要开发的网页被放进了一个 iframe 中，编辑源码后，iframe 会被自动刷新。 同时你会发现构建时间从 1566ms 减少到了 1130ms，说明优化生效了。构建性能提升的效果在要输出的 Chunk 数量越多时会显得越突出。

如果你**不想通过 iframe 的方式去访问，但同时又想让网页保持自动刷新功能，你需要手动往网页中注入代理客户端脚本**，往 index.html 中插入以下标签：

<!--注入 DevServer 提供的代理客户端脚本，这个服务是 DevServer 内置的-->

```javascript
<script src="http://localhost:8080/webpack-dev-server.js"></script>
```

给网页注入以上脚本后，独立打开的网页就能自动刷新了。但是要注意在发布到线上时记得删除掉这段用于开发环境的代码。

# 开启模块热替换
要做到实时预览，除了在4-5使用自动刷新中介绍的刷新整个网页外，DevServer 还支持一种叫做模块热替换(Hot Module Replacement)的技术可在**不刷新整个网页**的情况下做到超灵敏的实时预览。 原理是当一个源码发生变化时，只重新编译发生变化的模块，再用新输出的模块替换掉浏览器中对应的老模块。

模块热替换技术的优势有：

- 实时预览反应更快，等待时间更短。
- 不刷新浏览器能保留当前网页的运行状态，例如在使用 Redux 来管理数据的应用中搭配模块热替换能做到代码更新时 Redux 中的数据还保持不变。
- 总的来说模块热替换技术很大程度上的提高了开发效率和体验。

## 模块热替换的原理
模块热替换的原理和自动刷新原理类似，都需要往要开发的网页中注入一个**代理客户端**用于连接 DevServer 和网页， 不同在于模块热替换独特的模块替换机制。

DevServer 默认不会开启模块热替换模式，要开启该模式，只需在启动时带上参数 --hot，完整命令是 webpack-dev-server --hot。

除了通过在启动时带上 --hot 参数，还可以通过接入 Plugin 实现，相关代码如下：

const HotModuleReplacementPlugin = require('webpack/lib/HotModuleReplacementPlugin');

```javascript
module.exports = {
  entry:{
    // 为每个入口都注入代理客户端
    main:['webpack-dev-server/client?http://localhost:8080/', 'webpack/hot/dev-server','./src/main.js'],
  },
  plugins: [
    // 该插件的作用就是实现模块热替换，实际上当启动时带上 `--hot` 参数，会注入该插件，生成 .hot-update.json 文件。
    new HotModuleReplacementPlugin(),
  ],
  devServer:{
    // 告诉 DevServer 要开启模块热替换模式
    hot: true,      
  }  
};
```

在启动 Webpack 时带上参数 --hot 其实就是自动为你完成以上配置。

启动后日志如下：

```shell
> webpack-dev-server --hot

Project is running at http://localhost:8080/
webpack output is served from /
webpack: wait until bundle finished: /
webpack: wait until bundle finished: /bundle.js
Hash: fe62ac6b753c1d98961b
Version: webpack 3.5.5
Time: 3563ms
        Asset     Size  Chunks                    Chunk Names
    bundle.js  1.11 MB       0  [emitted]  [big]  main
bundle.js.map  1.33 MB       0  [emitted]         main
  [50] (webpack)/hot/log.js 1.04 kB {0} [built]
 [118] multi (webpack)-dev-server/client?http://localhost:8080 webpack/hot/dev-server ./main.js 52 bytes {0} [built]
 [119] (webpack)-dev-server/client?http://localhost:8080 5.83 kB {0} [built]
 [120] ./node_modules/url/url.js 23.3 kB {0} [built]
 [126] ./node_modules/strip-ansi/index.js 161 bytes {0} [built]
 [128] ./node_modules/loglevel/lib/loglevel.js 6.74 kB {0} [built]
 [129] (webpack)-dev-server/client/socket.js 856 bytes {0} [built]
 [161] (webpack)-dev-server/client/overlay.js 3.6 kB {0} [built]
 [166] (webpack)/hot nonrecursive ^\.\/log$ 170 bytes {0} [built]
 [168] (webpack)/hot/dev-server.js 1.61 kB {0} [built]
 [169] (webpack)/hot/log-apply-result.js 1.31 kB {0} [built]
 [170] ./main.js 2.35 kB {0} [built]
    + 262 hidden modules
```

可以看出 bundle.js 代理客户端相关的代码包含九个文件：

```shell
 [119] (webpack)-dev-server/client?http://localhost:8080 5.83 kB {0} [built]
 [120] ./node_modules/url/url.js 23.3 kB {0} [built]
 [126] ./node_modules/strip-ansi/index.js 161 bytes {0} [built]
 [128] ./node_modules/loglevel/lib/loglevel.js 6.74 kB {0} [built] 
 [129] (webpack)-dev-server/client/socket.js 856 bytes {0} [built]
 [161] (webpack)-dev-server/client/overlay.js 3.6 kB {0} [built]
 [166] (webpack)/hot nonrecursive ^\.\/log$ 170 bytes {0} [built]
 [168] (webpack)/hot/dev-server.js 1.61 kB {0} [built]
 [169] (webpack)/hot/log-apply-result.js 1.31 kB {0} [built]
```

相比于自动刷新的代理客户端，多出了后三个用于模块热替换的文件，也就是说代理客户端更大了。

修改源码 main.css 文件后，新输出了如下日志：

```shell
webpack: Compiling...
Hash: 18f81c959118f6230623
Version: webpack 3.5.5
Time: 551ms
                                   Asset       Size  Chunks                    Chunk Names
                               bundle.js    1.11 MB       0  [emitted]  [big]  main
    0.ea11a51f97f2b52bca7d.hot-update.js  353 bytes       0  [emitted]         main
    ea11a51f97f2b52bca7d.hot-update.json   43 bytes          [emitted]         
                           bundle.js.map    1.33 MB       0  [emitted]         main
0.ea11a51f97f2b52bca7d.hot-update.js.map  577 bytes       0  [emitted]         main
  [68] ./node_modules/css-loader!./main.css 217 bytes {0} [built]
 [166] (webpack)/hot nonrecursive ^\.\/log$ 170 bytes {0} [built]
    + 275 hidden modules
webpack: Compiled successfully.
```

DevServer 新生成了一个用于替换老模块的补丁文件 0.ea11a51f97f2b52bca7d.hot-update.js，同时在浏览器开发工具中也能看到请求这个补丁的抓包：

![](/images/assets/20200803163524396.png)


可见补丁中包含了 main.css 文件新编译出来 CSS 代码，网页中的样式也立刻变成了源码中描述的那样。

但当你修改 main.js 文件时，会发现模块热替换没有生效，而是整个页面被刷新了，为什么修改 main.js 文件时会这样呢？

Webpack 为了让使用者在使用了模块热替换功能时能灵活地控制老模块被替换时的逻辑，可以在源码中定义一些代码去做相应的处理。

把main.js 文件改为如下：

```javascript
import React from 'react';
import { render } from 'react-dom';
import { AppComponent } from './AppComponent';
import './main.css';

render(<AppComponent/>, window.document.getElementById('app'));

// 只有当开启了模块热替换时 module.hot 才存在
if (module.hot) {
  // accept 函数的第一个参数指出当前文件接受哪些子模块的替换，这里表示只接受 ./AppComponent 这个子模块
  // 第2个参数用于在新的子模块加载完毕后需要执行的逻辑
  module.hot.accept(['./AppComponent'], () => {
    // 新的 AppComponent 加载成功后重新执行下组建渲染逻辑
    render(<AppComponent/>, window.document.getElementById('app'));
  });
}
```

其中的 module.hot 是当开启模块热替换后注入到全局的 API，用于控制模块热替换的逻辑。

现在修改 AppComponent.js 文件，把 Hello,Webpack 改成 Hello,World，你会发现模块热替换生效了。 但是当你编辑 main.js 时，你会发现整个网页被刷新了。为什么修改这两个文件会有不一样的表现呢？

当子模块发生更新时，**更新事件会一层层往上传递**，也就是从 AppComponent.js 文件传递到 main.js 文件， 直到有某层的文件接受了当前变化的模块，也就是 main.js 文件中定义的 module.hot.accept(['./AppComponent'], callback)， 这时就会调用 callback 函数去执行自定义逻辑。**如果事件一直往上抛到最外层都没有文件接受它，就会直接刷新网页**。

那为什么没有地方接受过 .css 文件，但是修改所有的 .css 文件都会触发模块热替换呢？ 原因在于 style-loader 会注入用于接受 CSS 的代码。

> 请不要把模块热替换技术用于线上环境，它是专门为提升开发效率而生的。

## 优化模块热替换
在发生模块热替换时，你会在浏览器的控制台中看到类似这样的日志：

![](/images/assets/20200803164406699.png)


其中的 Updated modules: 68 是指 ID 为68的模块被替换了，这对开发者来说很不友好，因为开发者不知道 ID 和模块之间的对应关系，最好是把替换了的模块的名称输出出来。 Webpack 内置的 NamedModulesPlugin 插件可以解决该问题，修改 Webpack 配置文件接入该插件：

```javascript
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin');

module.exports = {
  plugins: [
    // 显示出被替换模块的名称
    new NamedModulesPlugin(),
  ],
};
```

重启构建后你会发现浏览器中的日志更加友好了：

![](/images/assets/20200803164442418.png)


除此之外，模块热替换还面临着和自动刷新一样的性能问题，因为它们都需要监听文件变化和注入客户端。 要优化模块热替换的构建性能，思路和在4-5 使用自动刷新中提到的很类似：**监听更少的文件，忽略掉 node_modules 目录下的文件**。 但是其中提到的关闭默认的 inline 模式手动注入代理客户端的优化方法**不能**用于在使用模块热替换的情况下， 原因在于模块热替换的运行依赖在每个 Chunk 中都包含代理客户端的代码。


# 区分环境
## 为什么需要区分环境
在开发网页的时候，一般都会有多套运行环境，例如：

- 在开发过程中方便开发调试的环境。
- 发布到线上给用户使用的运行环境。

这两套不同的环境虽然都是由同一套源代码编译而来，但是代码内容却不一样，差异包括：

- 线上代码被通过 4-8 压缩代码 中提到的方法压缩过。
- 开发用的代码包含一些用于提示开发者的提示日志，这些日志普通用户不可能去看它。
- 开发用的代码所连接的后端数据接口地址也可能和线上环境不同，因为要避免开发过程中造成对线上数据的影响。

为了尽可能的复用代码，在构建的过程中需要根据目标代码要运行的环境而输出不同的代码，我们需要一套机制在源码中去区分环境。 幸运的是 Webpack 已经为我们实现了这点。

## 如何区分环境
具体区分方法很简单，在源码中通过如下方式：

```javascript
if (process.env.NODE_ENV === 'production') {
  console.log('你正在线上环境');
} else {
  console.log('你正在使用开发环境');
}
```

其大概原理是借助于环境变量的值去判断执行哪个分支。

当你的代码中出现了使用 process 模块的语句时，Webpack 就自动打包进 process 模块的代码以支持非 Node.js 的运行环境。 当你的代码中没有使用 process 时就不会打包进 process 模块的代码。这个注入的 process 模块作用是为了模拟 Node.js 中的 process，以支持上面使用的 process.env.NODE_ENV === 'production' 语句。

在构建线上环境代码时，需要给当前运行环境设置环境变量 NODE_ENV = 'production'，Webpack 相关配置如下：

```javascript
const DefinePlugin = require('webpack/lib/DefinePlugin');

module.exports = {
  plugins: [
    new DefinePlugin({
      // 定义 NODE_ENV 环境变量为 production
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
  ],
};
```

注意在定义环境变量的值时用 JSON.stringify 包裹字符串的原因是**环境变量的值需要是一个由双引号包裹的字符串，而 JSON.stringify('production')的值正好等于'"production"'。**

执行构建后，你会在输出的文件中发现如下代码：

```javascript
if (true) {
  console.log('你正在使用线上环境');
} else {
  console.log('你正在使用开发环境');
}
```

定义的环境变量的值被代入到了源码中，process.env.NODE_ENV === 'production' 被直接替换成了 true。 并且由于此时访问 process 的语句被替换了而没有了，**Webpack 也不会打包进 process 模块了**。

DefinePlugin 定义的环境变量只对 Webpack 需要处理的代码有效，而不会影响 Node.js 运行时的环境变量的值。

通过 Shell 脚本的方式去定义的环境变量，例如 NODE_ENV=production webpack，Webpack 是不认识的，对 Webpack 需要处理的代码中的环境区分语句是没有作用的。

也就是说只需要通过 DefinePlugin 定义环境变量就能使上面介绍的环境区分语句正常工作，没必要又通过 Shell 脚本的方式去定义一遍。

如果你想让 Webpack 使用通过 Shell 脚本的方式去定义的环境变量，你可以使用 EnvironmentPlugin，代码如下：

```javascript
new webpack.EnvironmentPlugin(['NODE_ENV'])
以上这句代码实际上等价于：

new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
})
```

## 结合 UglifyJS
其实以上输出的代码还可以进一步优化，因为 if(true) 语句永远只会执行前一个分支中的代码，也就是说最佳的输出其实应该直接是：

```javascript
 console.log('你正在线上环境');
```

Webpack 没有实现去除死代码功能，但是 UglifyJS 可以做这个事情，如何使用请阅读 4-8 压缩代码 中的压缩 JavaScript。

## 第三方库中的环境区分
除了在自己写的源码中可以有环境区分的代码外，很多第三方库也做了环境区分的优化。 以 React 为例，它做了两套环境区分，分别是：

- 开发环境：包含类型检查、HTML 元素检查等等针对开发者的警告日志代码。
- 线上环境：去掉了所有针对开发者的代码，只保留让 React 能正常运行的部分，以优化大小和性能。
例如 React 源码中有大量类似下面这样的代码：

```javascript
if (process.env.NODE_ENV !== 'production') {
  warning(false, '%s(...): Can only update a mounted or mounting component.... ')
}
```

如果你不定义 NODE_ENV=production 那么这些警告日志就会被包含到输出的代码中，输出的文件将会非常大。

process.env.NODE_ENV !== 'production' 中的 NODE_ENV 和 'production' 两个值是社区的约定，通常使用这条判断语句在区分开发环境和线上环境。