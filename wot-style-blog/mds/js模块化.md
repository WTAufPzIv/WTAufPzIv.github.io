---
date: 2020-02-29
categories: [技术,前端,JavaScript]
thumbnail: /images/fe/module.jpg
toc: true
---
# 序言
javascript一直没有模块（module）的体系， 无法将一个大程序拆分成为互相依赖的小文件，再用很简单的方法将他们拼接起来。，随着web2.0时代的到来，Ajax技术得到广泛应用，前端代码日益膨胀，此时在JS方面就会考虑使用模块化规范去管理。

<!--more-->

# 什么是模块化
## 什么是模块
- 将一个复杂的程序依据一定的规则(规范)封装成几个块(文件), 并进行组合在一起
- 块的内部数据与实现是私有的, 只是向外部暴露一些接口(方法)与外部其它模块通信


## JavaScript模块化的进化历程
### 全局函数
作用：将不同的功能封装成为不同的函数

```javascript
function a(){
	...
}
function b(){
	...
}
```
缺点：污染全局命名空间，容易造成命名冲突和数据不安全的问题。

### 使用对象进行封装
作用：减少了全局变量，解决命名冲突

```javascript
let module = {
	name : 'tom',
	sayname:function(){
		console.log(this.name)
	}
}
module.name = 'Jack'
module,sayname() //Jack
```
缺点：内部模块暴露，成员可以被无限制访问与修改

### 匿名函数自调用（模仿块级作用域）
作用：
- 数据是私有的，外部无法访问和修改
- 将属性和方法定义到函数内部，然后通过window添加属性向外暴露接口

```javascript
(function(window){
	let name = 'tom'
	function sayname(){
		console.log(name)
	}
	window.myModule = {sayname} //给window添加属性以暴露方法
})(window)
```
缺点：如果当前这个模块依赖另一个模块怎么办?

### script引入依赖

```php
  <script type="text/javascript" src="module.js"></script>
  <script type="text/javascript">
    myModule.sayname()
  </script>
```


## 模块化的好处
- 避免命名空间污染
- 功能分离，按需加载
- 更高的复用性
- 更高的可维护性

##  < script >标签的问题
- 当需要依赖多个模块，会发送多个http请求，导致请求过多
- script标签的先后顺序需要严格按照模块之间的依赖关系来书写，对于使用者非常不友好
- 难以维护

# 现代的模块化规范
现在开发中最流行的模块化规范有：
- commonJS
- AMD
- CMD
- ES6规范
## CommonJS
### 概述
Node应用由模块组成， 采用的就是CommonJS模块规范。每个文件就是一个模块，有自己的作用域，文件里面定义的变量，函数都是私有的。
在服务端（node），模块的加载是运行时同步加载的。在客户端（浏览器），模块需要使用打包工具提前编译打包处理

### 支持的环境
node天生支持CommonJS，浏览器端无法支持，需要使用第三方打包工具才能支持

### 特点
- 每个模块有自己的块级作用域，不会污染全局
- 模块可以多次加载，但是第一次加载之后结果就会缓存，之后的加载直接从缓存中读取
- 模块的加载顺序是其在代码中的出现顺序

### 基本语法
- 暴露模块：module.exports = value或exports.xxx = value
- 引入模块：require(xxx),如果是第三方模块，xxx为模块名；如果是自定义模块，xxx为模块文件路径

```javascript
//module1
module.exports = {
	name:'tom',
	sayname:function(){
		console.log(this.name)
	}
}
```

```javascript
//module2
module.exports.foo = funtion(){
	console.log('this is module2')
}
```

```javascript
//module3
module.exports = function(){
	console.log('this is module3')
}
```

```javascript
//app
let a = require('./module1')
let b = require('./module2')
let c = require('./module3')

a.sayname() //tom
b.foo() // this is module2
c() //this is module3
```

**CommonJS暴露的模块到底是什么：**
	CommonJS规定，每个模块内部，module变量代表当前模块（可以理解为一个指向当前对象的指针），这个变量有一个exports是对外的接口，它本身也是一个对象。外部文件加载时，**实际上加载的是这个模块的exports对象**。因此，模块内部相当于先将要暴露的部分当做属性添加给exports，或直接将对象赋值给exports，外部文件再从exports中取出属性使用。

而require命令，则读入并执行一个js文件，然后返回该模块的exports对象，如果没有发现，会报错

### CommonJS加载机制
输入的是被输出值的拷贝，也就是说对于js基本数据类型，一旦输出一个值，模块内再发生变化时，将不会对已经输出的值产生影响

```javascript
//lib
var counter = 3;
function incCounter() {
  counter++;
}
module.exports = {
  counter: counter,
  incCounter: incCounter,
};
```

```javascript
var counter = require('./lib').counter;
var incCounter = require('./lib').incCounter;

console.log(counter);  // 3
incCounter();
console.log(counter); // 3
```
counter是一个基本数据类型的值，会被缓存

## AMD（RequireJS） 与CMD（SeaJS）
### 支持的环境
原生JS均不支持，需要使用requireJS和seaJS，一般用于浏览器端

CommonJS规范加载模块是同步的，也就是说，只有加载完成，才能执行后面的操作。AMD规范则是非同步加载模块，允许指定回调函数。由于Node.js主要用于服务器编程，模块文件一般都已经存在于本地硬盘，所以加载起来比较快，不用考虑非同步加载的方式，所以CommonJS规范比较适用。但是，如果是浏览器环境，要从服务器端加载模块，这时就必须采用非同步模式，因此浏览器端一般采用AMD规范。此外AMD规范比CommonJS规范在浏览器端实现要来着早。

CMD规范专门用于浏览器端，模块的加载是异步的，模块使用时才会加载执行。CMD规范整合了CommonJS和AMD规范的特点。在 Sea.js 中，所有 JavaScript 模块都遵循 CMD模块定义规范。

```javascript
// AMD
// 定义模块 myModule.js
define(['dependency'], function(){
    var name = 'Byron';
    function printName(){
        console.log(name);
    }

    return {
        printName: printName
    };
});

// 加载模块
require(['myModule'], function (my){
　 my.printName();
});

// CMD
define(function(require, exports, module) {
  // 加载模块
  // 可以把 require 写在函数体的任意地方实现延迟加载
  var a = require('./a')
  a.doSomething()
})
```

## ES6模块化
ES6 模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。CommonJS 和 AMD 模块，都只能在运行时确定这些东西。比如，CommonJS 模块就是对象，输入时必须查找对象属性。

### 支持的环境
浏览器端和node均不支持，需要通过babel语法转换，或者依赖打包工具（如webpack）来使用。

目前谷歌浏览器可以通过设置[chrome://flags/](chrome://flags/)将Experimental JavaScript设置为enable，node端把文件名后缀修改为mjs即可。这些途径目前均在试验阶段。

### 语法
export命令用于规定模块的对外接口，import命令用于输入其他模块提供的功能。

```javascript
/** 定义模块 math.js **/
var basicNum = 0;
var add = function (a, b) {
    return a + b;
};
export { basicNum, add };
/** 引用模块 **/
import { basicNum, add } from './math';
function test(ele) {
    ele.textContent = add(99 + basicNum);
}
```
如上例所示，使用import命令的时候，用户需要知道所要加载的变量名或函数名，否则无法加载。为了给用户提供方便，让他们不用阅读文档就能加载模块，就要用到export default命令，为模块指定默认输出。

```javascript
// export-default.js
export default function () {
  console.log('foo');
}
// import-default.js
import customName from './export-default';
customName(); // 'foo'
```
模块默认输出, 其他模块加载该模块时，import命令可以为该匿名函数指定任意名字。

### ES6模块化与CommonJS的差异
- CommonJS输出的是一个值的拷贝， ES6输出的是值的**引用**
- CommonJS模块是运行时候加载，ES6模块是编译时输出接口

```javascript
// lib.js
export let counter = 3;
export function incCounter() {
  counter++;
}
// main.js
import { counter, incCounter } from './lib';
console.log(counter); // 3
incCounter();
console.log(counter); // 4
```
ES6 模块的运行机制与 CommonJS 不一样。ES6 模块是动态引用，并且不会缓存值，模块里面的变量绑定其所在的模块。


# 总结
- CommonJS规范主要用于服务端编程，加载模块是同步的，这并不适合在浏览器环境，因为同步意味着阻塞加载，浏览器资源是异步加载的，因此有了AMD CMD解决方案。
- AMD规范在浏览器环境中异步加载模块，而且可以并行加载多个模块。不过，AMD规范开发成本高，代码的阅读和书写比较困难，模块定义方式的语义不顺畅。
- CMD规范与AMD规范很相似，都用于浏览器编程，依赖就近，延迟执行，可以很容易在Node.js中运行。不过，依赖SPM 打包，模块的加载逻辑偏重
- ES6 在语言标准的层面上，实现了模块功能，而且实现得相当简单，完全可以取代 CommonJS 和 AMD 规范，成为浏览器和服务器通用的模块解决方案。
