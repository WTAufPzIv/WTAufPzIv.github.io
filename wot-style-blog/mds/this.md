---
date: 2020-01-29
categories: [技术,前端,JavaScript]
thumbnail: /images/fe/this.jpg
toc: true
---
# 关于this对象
## this的概念
它代表函数运行时，自动生成的一个内部对象，只能在函数内部使用 —— 阮一峰
这句话表明，this只与函数运行时的环境有关，而与初始化时的环境无关
<!--more-->

## 四种this的绑定方式
### 默认绑定

```javascript
function a(){
	console.log(this.bar)
}
var bar = 'bar1'
var o1 = {bar: 'bar2', foo: a}
var o2 = {bar: 'bar3', foo: a}
a() //'bar1'  默认绑定
```
### 隐式绑定

```javascript
function a(){
	console.log(this.bar)
}
var bar = 'bar1'
var o1 = {bar: 'bar2', foo: a}
var o2 = {bar: 'bar3', foo: a}
o1.foo()//'bar2' 隐式绑定
//谁调用，就指向谁
```
### 显式绑定
如果函数通过call，apply，bind调用，那么这种绑定就称为显式绑定， this指向三个函数当中的参数
```javascript
function a(){
	console.log(this.bar)
}
var o = {bar: 'hhh'}
a.call(o) //'hhh'   显式绑定
```
### 关键字new绑定
此时this指向new出来的那个对象
```javascript
function a(){
	console.log(this.bar)
}
var b = new a() //undefine
```
## 箭头函数不一样
箭头函数无视以上规则，this的值就是函数创建时所在的对象，对比以下两个例子

```javascript
function Person(){
	this.age = 10
	setTimeout(function(){
		console.log(this.age) //undefine
	},1000)
}
var p = new Person()
```

```javascript
function Person(){
	this.age = 10
	setTimeout(() => {
		console.log(this.age) //10
	},1000)
}
var p = new Person()
```
上述两个例子中，前者setTimeout内部的函数是**global**调用的，而global中没有age这一属性。后者使用了箭头函数，this就会绑定在Person上。

## 绑定优先级
1、箭头函数
2、关键字new
3、显示绑定
4、隐式绑定
5、默认绑定

## bind，apply，call的理解
call 和 apply 都是为了解决改变 this 的指向，作用都是相同的，只是传参的方式不同。除了第一个参数外，call 可以接收一个参数列表（就是一个个传参），apply 只接受一个参数数组（把参数组合成为一个数组）。返回值是函数的返回值，若函数无返回值，则返回undefine

```javascript
let a = {
    value: 1
}
function getValue(name, age) {
    console.log(name)
    console.log(age)
    console.log(this.value)
}
getValue.call(a, 'yck', '24')
getValue.apply(a, ['yck', '24'])
```
bind作用和上面两个一样，传参和call一样，但是返回的是改变了this指向后的**函数**

### 分别手动实现call, apply, bind
实现的依据与原理很简单：函数的this，谁调用，就指向谁
#### 实现一个call
思路：
1.、这个函数怎么下手，换句话说，写在哪里
call是所有函数自带的属性，我们要自定义一个call，当然是给Function类型添加myCall属性
2、函数接收的参数
第一个参数是被绑定对象，所以函数参数是第二个接收参数及其之后的参数
3、这个this指向怎么改变
如果调用者函数，被某一个对象所拥有，那么该函数在调用时，内部的this指向该对象。

```javascript
Function.prototype.myCall = functon(context){
	//获取参数中被绑定的上下文
	var ctx = context || window
	
	//将当前执行的这个函数作为一个属性加入到上下文中
	ctx.fun = this

	//将第二个及其之后的参数取出来(也可能没有)
	var args = [...arguments].slice(1)
	//在上下文环境中执行这个函数，触发隐式绑定，同时保存返回值
	var res = ctx.fun(...args)

	//删除ctx中的fun，避免造成污染
	delete ctx.fun

	return res
}
```

#### 实现一个apply
掌握了实现call，那么apply也就依葫芦画瓢了

```javascript
Function.prototype.myApply = functon(context){
	//获取参数中被绑定的上下文
	var ctx = context || window
	
	//将当前执行的这个函数作为一个属性加入到上下文中
	ctx.fun = this

	//判断是否存在第二个参数
	var res
	if(arguments[1]){
		res = ctx.fun(...arguments[1])
	}
	else{
		res = ctx.fun()
	}
	//删除ctx中的fun，避免造成污染
	delete ctx.fun

	return res
}
```

#### 实现一个bind
这个和上述两个不一样，一个是返回值，call和apply返回函数执行结果，而bind返回的是函数。call和apply会立即执行函数，但是bind并不立即执行
bind 返回了一个函数，对于函数来说有两种方式调用，一种是直接调用，一种是通过 new 的方式，所以两种方式都要考虑到

 - 对于直接调用来说，这里选择了 apply 的方式实现，但是对于参数需要注意以下情况：**因为 bind 可以实现类似这样的代码 f.bind(obj, 1)(2)，所以我们需要将两边的参数拼接起来，于是就有了这样的实现 args.concat(...arguments)**
 - 通过 new 的方式。对于 new 的情况来说，不会被任何方式改变 this，所以对于这种情况我们需要忽略传入的 this

```javascript
Function.prototype.myBind = function (context) {
  if (typeof this !== 'function') {
    throw new TypeError('Error')
  }
  const self = this
  const args = [...arguments].slice(1)
  // 返回一个函数
  var fbound = function () {
  	var bindArgs = Array.prototype.slice.call(arguments);
    // 当作为构造函数时，this 指向实例，self 指向绑定函数，因为原型链被复制，所以此时结果为 true，当结果为 true 的时候，忽略this
    // 当作为普通函数时，this 指向 window，self 指向绑定函数，此时结果为 false，当结果为 false 的时候，this 指向绑定的 context。
    self.apply(this instanceof self ? this : context, args.concat(bindArgs));
  }
    // 复制一下原型链，
   fbound.prototype = this.prototype;
   return fbound;
}
```
