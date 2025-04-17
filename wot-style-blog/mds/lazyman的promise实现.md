---
date: 2020-04-09
categories: [技术,前端,JavaScript]
thumbnail: /images/fe/lazy.jpg
toc: true
---


# 原题目要求

> 实现一个lazyman:

```js
lazy('tom').eat('apple').sleetFirst(1).eat('water').sleep(1).eat('奥利给')
```

输出:
睡了一分钟
我的名字叫tom
吃了个苹果
喝了点水
睡了一分钟
吃了奥利给

<!--more-->

# 核心抽离

我们现在先抛开题目本身，将核心功能抽离出来，假设现在有三个活动

```js
let a = function(){
     console.log(1)
}
let b = function(){
    setTimeout(() => {
        console.log(2)
        resolve()
    }, 0)
}
let c = function(){
    console.log(3)
}
```
我们依次执行他们：
```js
a()
b()
c()
```
最后输出：132

对于上述三个活动，我要实现他们的顺序执行，可以利用promise的链式调用原理，因为Promise的链式调用可以严格遵循调用时候的顺序

既然要支持链式调用，那么我们让每一个活动返回一个Promise对象，那么三个活动就可以作出如下修改
```js
let a = function(){
    return new Promise(function(resolve){
        console.log(1)
        resolve()
    })
}

let b = function(){
    return new Promise(function(resolve){
        setTimeout(() => {
            console.log(2)
            resolve()
        }, 1000)
    })
}



let c = function(){
    return new Promise(function(resolve){
        console.log(3)
    })
}
```
然后就可以再用一个promise将上面三个活动包起来，以下面这样的形式进行调用：
```js
new Promise(function(resolve){
    resolve()
})
.then(function(){
    return a()
})
.then(function(){
    return b()
})
.then(function(){
    return c()
})
```
输出结果：123

# 具体实现
了核心功能的实现之后，就可以进行代码编写

## 首先是函数主体部分：

```javascript
function lazyman(name){
    return new _lazyman(name)
}
function _lazyman(name){
    let flag = Promise.resolve()
    this.name = name
    this.fun_stack = []
    let self = this
    function fn(){
        console.log('我的名字是' + self.name)
        return Promise.resolve()
    }
    this.fun_stack.push(fn)

    setTimeout(function(){
        self.fun_stack.forEach(fn => {
            flag = flag.then(fn)
        })
    })
}
```
这里使用的flag就相当于充当了所有活动最外层包裹的Promise，用于实现链式调用的顺序执行
fun_stack用于将活动暂存，因为有FirstSleep与sleep的存在，所以不能一调用事物就立即执行，需要进行暂存
在清空fun_stack时使用了setTimeout，是因为要等到链式完整书写完才能执行，否则会出现链式调用无法运行

## 接下来是睡觉部分
首先是sleep
```javascript
_lazyman.prototype.sleep = function(time){
    function fn(){
        return new Promise(function(resolve){
            console.log('开始睡午觉')
            setTimeout(function(){
                console.log('午觉睡醒了')
                resolve()

            }, time * 1000)
        })
    }
    this.fun_stack.push(fn)
    return this
}
```
sleepFirst实现和sleep几乎一样，唯一的不同是入队列时要压到队列最前方，保证链式调用时优先执行

```javascript
_lazyman.prototype.sleepFirst = function(time){
    function fn(){
        return new Promise(function(resolve){
            console.log('开始睡觉')
            setTimeout(function(){
                console.log('睡醒了')
                resolve()

            }, time * 1000)
        })
    }
    this.fun_stack.unshift(fn)
    return this
}
```

## 吃东西部分

```javascript
_lazyman.prototype.eat = function(food){
    function fn(){
        console.log('正在吃' + food)
        return Promise.resolve()
    }
    this.fun_stack.push(fn)
    return this
}
```
这部分没有一部代码，因此直接使用```Promise.resolve()```返回一个已经resolve的Promise对象

## 运行效果

```javascript
lazyman('怪鸽~').sleepFirst(1).eat('奥利给').sleep(2).eat('老八秘制小汉堡')
```
![](/images/assets/20200409113002554.png)

# 完整代码

```javascript
function lazyman(name){
    return new _lazyman(name)
}
function _lazyman(name){
    let flag = Promise.resolve()
    this.name = name
    this.fun_stack = []
    let self = this
    function fn(){
        console.log('我的名字是' + self.name)
        return Promise.resolve()
    }
    this.fun_stack.push(fn)


    setTimeout(function(){
        self.fun_stack.forEach(fn => {
            flag = flag.then(fn)
        })
    })
}
_lazyman.prototype.sleep = function(time){
    let self = this
    function fn(){
        return new Promise(function(resolve){
            console.log(self.name + '开始睡午觉')
            setTimeout(function(){
                console.log(self.name + '午觉睡醒了')
                resolve()

            }, time * 1000)
        })
    }
    this.fun_stack.push(fn)
    return this
}
_lazyman.prototype.sleepFirst = function(time){
    let self = this
    function fn(){
        return new Promise(function(resolve){
            console.log(self.name + '开始睡觉')
            setTimeout(function(){
                console.log(self.name + '睡醒了')
                resolve()

            }, time * 1000)
        })
    }
    this.fun_stack.unshift(fn)
    return this
}
_lazyman.prototype.eat = function(food){
    let self = this
    function fn(){
        console.log(self.name + '正在吃' + food)
        return Promise.resolve()
    }
    this.fun_stack.push(fn)
    return this
}
```
