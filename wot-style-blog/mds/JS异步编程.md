---
date: 2020-03-02
categories: [技术,前端,JavaScript]
thumbnail: /images/fe/yibu.jpg
toc: true
---
# 序言
在event loop中我们已经学习了，js是一门单线程语言，这意味着通常情况下JS运行的代码是同步且阻塞的，但是在实际应用中，尤其是在浏览器端，这种同步阻塞的编程无法实现特定的需求，当遇到一些耗时的计算，请求时就会造成后续线程的等待甚至卡死，给用户造成非常糟糕的体验。

基于这个问题，JS的异步编程解决方案应运而生。时至今日，前端开发人员依然能听到一句话：**JS是单线程的，天生异步，适合IO密集型，不适合CPU密集型**

接下来就来了解JS异步编程的实现方案

<!--more-->

# 回调函数
一提到回调函数所有人应该都不陌生，从第一天学习JS开始，我们就了解到JS的一个全局函数：setTimeout。

```javascript
setTimeout(function () {
    console.log('Time out');
}, 1000);
```
在event loop这篇文章中，我们重新认识了setTimeout，它不再是一个简简单单的让代码延迟执行的定时器函数，同时也是JS实现异步编程的一个工具之一
上述例子中，setTimeout内部的这个匿名函数，就叫做setTimeout的**回调函数**，意义就是在1秒之后，执行回调函数

对于回调函数，大多数人的第一反应应该还是ajax的回调，在请求完成之后执行一段代码。这样看来，回调函数似乎还蛮好用的，能够手动掌握一些代码的执行顺序，但是，考虑一下下面这个情况：

## 回调地狱

![](/images/assets/2020030211081087.png)
这是微信小程序官方推荐（规定）的登录流程，可以看到，对于前端来说，需要先调用wx.login()接口获取code，然后使用code向自己的后台请求session_key，之后再调用其他业务接口时带上这个session_key，后台再返回数据。

对于上述流程，在使用axaj回调函数时，代码是这样的

```javascript
wx.login({
 success(res) {
 //第一层回调,调用wx.login接口
    if (res.code) {
      ajax.request({
        method: 'POST',
        url: 'user/register',
        data: {
          code: res.code,
        },
        success: result => {
          //第二层回调，获取session_key
          ajax.request({
	        method: 'POST',
	        url: 'user/getinfo',
	        data: {
	          session_key: res.session_key,
	        },
	        success: result => {
	          //第三层回调，获取业务数据
	          ...
	        },
	      })
        },
      })
    }
  }
})
```
可以看到，整段代码充满了回调嵌套，代码不仅在纵向扩展，横向也在扩展。我相信，对于任何人来说，调试起来都会很困难，我们不得不从一个函数跳到下一个，再跳到下一个，在整个代码中跳来跳去以查看流程，而最终的结果藏在整段代码的中间位置。真实的JavaScript程序代码可能要混乱的多，使得这种追踪难度会成倍增加。这就是我们常说的**回调地狱（Callback Hell）**。

为什么会出现这种现象？

如果某个业务，依赖于上层业务的数据，上层业务又依赖于更上一层的数据，我们还采用回调的方式来处理异步的话，就会出现回调地狱。

大脑对于事情的计划方式是线性的、阻塞的、单线程的语义，但是回调表达异步流程的方式是非线性的、非顺序的，这使得正确推导这样的代码的难度很大，很容易产生Bug。


## 控制反转

```javascript
// A
$.ajax({
    ...
    success: function (...) {
        // C
    }
});
// B
```
对于上述代码，代码A和代码B是同步代码，由JavaScript的event loop机制监督执行，换句话说，JS扮演了一个绝对可靠的执行者，我们将代码交给它去执行。而代码C，却是由ajax库提供的回调API来执行，这个第三方的身份相对于JS来说就不是那么可靠。

ajax大家都知道是JS提供的异步请求方法与标准，这个问题在这个例子上貌似不会有太严重，但是，请不要被这个小概率迷惑而认为这种控制切换不是什么大问题。实际上，这是回调驱动设计最严重（也是最微妙）的问题。它以这样一个思路为中心：有时候ajax(...)，也就是**你交付回调函数的第三方不是你编写的代码，也不在你的直接控制之下，它是某个第三方提供的工具。**

**这种情况称为控制反转，也就是把自己程序一部分的执行控制交给某个第三方，在你的代码和第三方工具直接有一份并没有明确表达的契约。**

既然是无法控制的第三方在执行你的回调函数，那么就有可能存在以下问题，当然通常情况下是不会发生的：

- 调用回调过早
- 调用回调过晚
- 调用回调次数太多或者太少
- 未能把所需的参数成功传给你的回调函数
- 吞掉可能出现的错误或异常
- ......

这种控制反转会导致信任链的完全断裂，如果你没有采取行动来解决这些控制反转导致的信任问题，那么你的代码已经有了隐藏的Bug，尽管我们大多数人都没有这样做。

# Promise
**开门见山，Promise解决的是回调函数处理异步的第2个问题：控制反转**
在event loop中我们知道了，对于异步代码，event loop会将其放入event queue（任务队列）当中。而任务队列又分为宏队列和微队列，Promise就被分在了微队列当中。

由此可见，使用Promise之后代码的运行将由event loop完全接管，由Javascript运行机制来运行

## Promise的含义
所谓Promisem，简单来说就是一个容器，里面保存着某个未来才会结束的事件的结果，说白了就是一个耗时操作。从语法上来说，Promise是一个对象，他可以获取异步操作的消息，Promise提供统一的API，各种异步操作可以用同样的方法进行处理。

Promise对象有两个特点：

- 对象的状态不受外界影响。Promise有三种状态：Pending（进行中）， Fulfilled（已成功）， Rejected（已失败），只有异步操作的结果可以改变这个状态，其他手段无法改变
- 一旦状态改变之后就是稳定下来，不会发生二次改变。从pending变为Fulfilled或Rejected后，就一直保持这个结果，称为Resolve（已定型）。
![](/images/assets/20200302125811393.png)
Promise可以将异步操作用同步的流程表达出来，避免了层层嵌套

## 用法
Promise是一个构造函数 ，可以生成实例对象

```javascript
var promise = new Promise(function(resolve, reject){
	//....一些代码
	if(//异步操作成功){
		resolve(value)
	}
	else{
		reject(err)
	}
})
```
Promise构造函数接收一个函数作为参数，这个函数接收两个参数：resolve和reject。resolve的作用是将状态从pending变为Resolve，并将异步操作的结果带出去，异步操作成功时调用。reject的作用是将状态从pending变为Reject， 异步操作失败时调用，并将错误传递出去。

Promise实例生成后可以指定then方法作为回调，then方法接收两个函数作为参数， 第一个是promise状态变为resolved时调用，第二个是状态变为rejected时调用，其中，第二个参数是可选的

一个简单的例子
```javascript
let propmise = new Promise(function(resolve, reject){
	console.log('a')
	resolve()
})

promise.then(function{
	console.log('b')
})

console.log('c')

//结果:acb
```

## 链式调用
我们把上面那个多层回调嵌套的例子用Promise的方式重构

```javascript
//获取code
let getKeyPromise = function () {
    return new Promsie(function (resolve, reject) {
       wx.login({
		 success(res) {
		 //第一层回调,调用wx.login接口
		    if (res.code) {
		    	resolve(res.code)
		    }
		  }
		})
    });
};
//获取session_ket
let getTokenPromise = function (key) {
    return new Promsie(function (resolve, reject) {
        $.ajax({
            type: 'get',
            url: 'http://localhost:3000/getToken',
            data: {
                code: key
            },
            success: function (res) {
                resolve(res.session_key);         
            },
            error: function (err) {
                reject(err);
            }
        });
    });
};
//获取业务数据
let getDataPromise = function (data) {
    return new Promsie(function (resolve, reject) {
        $.ajax({
            type: 'get',
            url: 'http://localhost:3000/getData',
            data: {
                session_key: data,
            },
            success: function (res) {
                resolve(res.userinfo);         
            },
            error: function (err) {
                reject(err);
            }
        });
    });
};

getKeyPromise()
.then(function (key) {
    return getTokenPromise(key);
})
.then(function (data) {
    return getDataPromise(data);
})
.then(function (data) {
    console.log('业务数据：', data);
})
.catch(function (err) {
    console.log(err);
}); 
```
可以看到，Promise在一定程度上其实改善了回调函数的书写方式，最明显的一点就是去除了横向扩展，无论有再多的业务依赖，通过多个then(...)来获取数据，让代码只在纵向进行扩展；另外一点就是逻辑性更明显了，将异步业务提取成单个函数，整个流程可以看到是一步步向下执行的，依赖层级也很清晰，最后需要的数据是在整个代码的最后一步获得。

所以，Promise在一定程度上解决了回调函数的书写结构问题，但回调函数依然在主流程上存在，只不过都放到了then(...)里面，和我们大脑顺序线性的思维逻辑还是有出入的。

## 手动实现一个Promise
### Promise/A+ 规范：
ES6主要用的是Promise/A+规范:

- Promise本身是一个状态机，每一个Promise实例只能有三个状态，pending、fulfilled、reject，状态之间的转化只能是pending->fulfilled、pending->reject，状态变化不可逆。
- Promise有一个then方法，该方法可以被调用多次，并且返回一个Promise对象（返回新的Promise还是老的Promise对象，规范没有提）。
- 支持链式调用。
- 内部保存有一个value值，用来保存上次执行的结果值，如果报错，则保存的是异常信息

### 基本结构
实例化Promise对象时传入一个函数作为执行器，有两个参数（resolve和reject）分别将结果变为成功态和失败态。我们可以写出基本结构

```javascript
function MyPromise(executor) {
    this.state = 'pending'; //状态
    this.value = undefined; //成功结果
    this.reason = undefined; //失败原因

    function resolve(value) {
        
    }

    function reject(reason) {

    }
}

module.exports = Promise;
```
其中state属性保存了Promise对象的状态，规范中指明，一个Promise对象只有三种状态：等待态（pending）成功态（resolved）和失败态（rejected）。
当一个Promise对象执行成功了要有一个结果，它使用value属性保存；也有可能由于某种原因失败了，这个失败原因放在reason属性中保存。


### then方法定义在原型上
每一个Promise实例都有一个then方法，它用来处理异步返回的结果，它是定义在原型上的方法，我们先写一个空方法做好准备：

```javascript
Promise.prototype.then = function (onFulfilled, onRejected) {
};
```

### 当实例化Promise时会立即执行传入的函数
注意：当我们自己实例化一个Promise时，其执行器函数（executor）**会立即执行**，这是一定的：
因此，当实例化Promise时，构造函数中就要马上调用传入的executor函数执行

```javascript
function Promise(executor) {
    var _this = this;
    this.state = 'pending';
    this.value = undefined;
    this.reason = undefined;

    executor(resolve, reject); //马上执行
    
    function resolve(value) {}
    function reject(reason) {}
}
```

### 已经是成功态或是失败态不可再更新状态
规范中规定，当Promise对象已经由pending状态改变为了成功态（resolved）或是失败态（rejected）就不能再次更改状态了。因此我们在更新状态时要判断，如果当前状态是pending（等待态）才可更新：

  

```javascript
  function resolve(value) {
        //当状态为pending时再做更新
        if (_this.state === 'pending') {
            _this.value = value;//保存成功结果
            _this.state = 'resolved';
        }

    }

    function reject(reason) {
    //当状态为pending时再做更新
        if (_this.state === 'pending') {
            _this.reason = reason;//保存失败原因
            _this.state = 'rejected';
        }
    }
```

以上可以看到，在resolve和reject函数中分别加入了判断，只有当前状态是pending才可进行操作，同时将成功的结果和失败的原因都保存到对应的属性上。之后将state属性置为更新后的状态。

### then方法的基本实现
当Promise的状态发生了改变，不论是成功或是失败都会调用then方法，所以，then方法的实现也很简单，根据state状态来调用不同的回调函数即可：

```javascript
Promise.prototype.then = function (onFulfilled, onRejected) {
    if (this.state === 'resolved') {
        //判断参数类型，如果是函数，则进行递归调用
        if (typeof onFulfilled === 'function') {
            onFulfilled(this.value);
        }

    }
    if (this.state === 'rejected') {
        if (typeof onRejected === 'function') {
            onRejected(this.reason);
        }
    }
};
```

需要一点注意，规范中说明了，**onFulfilled 和 onRejected 都是可选参数，也就是说可以传也可以不传。传入的回调函数也不是一定函数类型**，那怎么办？规范中说忽略它就好了。因此需要判断一下回调函数的类型，如果明确是个函数再执行它。

### 让Promise支持异步
代码写到这里似乎基本功能都实现了，可是还有一个很大的问题，目前此Promise还不支持异步代码，如果Promise中封装的是异步操作，then方法无能为力：

```javascript
let p = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve(1);
    }，500);
});

p.then(data => console.log(data)); //没有任何结果
```

运行以上代码发现没有任何结果，本意是等500毫秒后执行then方法，哪里有问题呢？原因是setTimeout函数使得resolve是异步执行的，有延迟，当调用then方法的时候，此时此刻的状态还是等待态（pending），因此then方法即没有调用onFulfilled也没有调用onRejected。

这个问题如何解决？我们可以参照发布订阅模式，在执行then方法时如果还在等待态（pending），就把回调函数临时寄存到一个数组里，当状态发生改变时依次从数组中取出执行就好了，清楚这个思路我们实现它，首先在类上新增两个Array类型的数组，用于存放回调函数：

```javascript
function Promise(executor) {
    var _this = this;
    this.state = 'pending';
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledFunc = [];//保存成功回调
    this.onRejectedFunc = [];//保存失败回调
    //其它代码略...
}
```

这样当then方法执行时，若状态还在等待态（pending），将回调函数依次放入数组中：

```javascript
Promise.prototype.then = function (onFulfilled, onRejected) {
    //等待态，此时异步代码还没有走完
    if (this.state === 'pending') {
        if (typeof onFulfilled === 'function') {
            this.onFulfilledFunc.push(onFulfilled);//保存回调
        }
        if (typeof onRejected === 'function') {
            this.onRejectedFunc.push(onRejected);//保存回调
        }
    }
    //其它代码略...
};
```

寄存好了回调，接下来就是当状态改变时执行就好了：

   

```javascript
 function resolve(value) {
    if (_this.state === 'pending') {
        _this.value = value;
        //依次执行成功回调
        _this.onFulfilledFunc.forEach(fn => fn(value));
        _this.state = 'resolved';
    }

}

function reject(reason) {
   if (_this.state === 'pending') {
        _this.reason = reason;
        //依次执行失败回调
        _this.onRejectedFunc.forEach(fn => fn(reason));
        _this.state = 'rejected';
    }
}
```

至此，Promise已经支持了异步操作，setTimeout延迟后也可正确执行then方法返回结果。

### 链式调用
Promise处理异步代码最强大的地方就是**支持链式调用**，这块也是最复杂的，我们先梳理一下规范中是怎么定义的：

- **每个then方法都返回一个新的Promise对象（原理的核心）**
- 如果then方法中显示地返回了一个Promise对象就以此对象为准，返回它的结果
- 如果then方法中返回的是一个普通值（如Number、String等）就使用此值包装成一个新的Promise对象返回。
- 如果then方法中没有return语句，就视为返回一个用Undefined包装的Promise对象
- 若then方法中出现异常，则调用失败态方法（reject）跳转到下一个then的onRejected
- 如果then方法没有传入任何回调，则继续向下传递（值的传递特性）。
规范中说的很抽像，我们可以把不好理解的点使用代码演示一下。



其中第3项，如果返回是个普通值就使用它包装成Promise，我们用代码来演示：

```javascript
let p =new Promise((resolve,reject)=>{
    resolve(1);
});

p.then(data=>{
    return 2; //返回一个普通值
}).then(data=>{
    console.log(data); //输出2
});
```

可见，当then返回了一个普通的值时，**下一个then的成功态回调中即可取到上一个then的返回结果，说明了上一个then正是使用2来包装成的Promise**，这符合规范中说的。

第4项，如果then方法中没有return语句，就视为返回一个用Undefined包装的Promise对象

```javascript
let p = new Promise((resolve, reject) => {
    resolve(1);
});

p.then(data => {
    //没有return语句
}).then(data => {
    console.log(data); //undefined
});
```

可以看到，**当没有返回任何值时不会报错，没有任何语句时实际上就是return undefined;即将undefined包装成Promise对象传给下一个then的成功态**。

第6项，如果then方法没有传入任何回调，则继续向下传递，这是什么意思呢？这就是**Promise中值的穿透**，还是用代码演示一下：

```javascript
let p = new Promise((resolve, reject) => {
    resolve(1);
});

p.then(data => 2)
.then()
.then()
.then(data => {
    console.log(data); //2
});
```

**以上代码，在第一个then方法之后连续调用了两个空的then方法 ，没有传入任何回调函数，也没有返回值，此时Promise会将值一值向下传递，直到你接收处理它，这就是所谓的值的穿透**。

当然，then方法也可以手动返回一个Promise对象

现在可以明白链式调用的原理，不论是何种情况then方法都会返回一个Promise对象，这样才会有下个then方法。

搞清楚了这些点，我们就可以动手实现then方法的链式调用，一起来完善它：

```javascript

Promise.prototype.then = function (onFulfilled, onRejected) {
    var promise2 = new Promise((resolve, reject) => {
    //代码略...
    }
    return promise2;
};
```

首先，不论何种情况then都返回Promise对象，我们就实例化一个新promise2并返回。

接下来就处理根据上一个then方法的返回值来生成新Promise对象，由于这块逻辑较复杂且有很多处调用，我们抽离出一个方法来操作，这也是规范中说明的。

**resolvePromise方法用来封装链式调用产生的结果，下面我们分别一个个情况的写出它的逻辑，首先规范中说明，如果promise2和 x 指向同一对象，就使用TypeError作为原因转为失败**

当then的返回值与新生成的Promise对象为同一个（引用地址相同），则会抛出TypeError错误：

```javascript
let promise2 = p.then(data => {
    return promise2;
});
```

运行结果：

TypeError: Chaining cycle detected for promise #<Promise>

很显然，如果返回了自己的Promise对象，状态永远为等待态（pending），再也无法成为resolved或是rejected，程序会死掉，因此首先要处理它：

```javascript
/**
* 解析then返回值与新Promise对象
* @param {Object} promise2 新的Promise对象 
* @param {*} x 上一个then的返回值
* @param {Function} resolve promise2的resolve
* @param {Function} reject promise2的reject
*/
function resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
        reject(new TypeError('Promise发生了循环引用'));
    }
}
```

接下来就是分各种情况处理。当x就是一个Promise，那么就执行它，成功即成功，失败即失败。若x是一个对象或是函数，再进一步处理它，否则就是一个普通值：

```javascript
function resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
        reject(new TypeError('Promise发生了循环引用'));
    }

    if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
        //可能是个对象或是函数
    } else {
        //否则是个普通值
        resolve(x);
    }
}
```

此时规范中说明，若是个对象，则尝试将对象上的then方法取出来，此时如果报错，那就将promise2转为失败态。原文：


```javascript
function resolvePromise(promise2, x, resolve, reject) {
    //代码略...
    if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
        //可能是个对象或是函数
        try {
            let then = x.then;//取出then方法引用
        } catch (e) {
            reject(e);
        }
        
    } else {
        //否则是个普通值
        resolve(x);
    }
}
```

多说几句，为什么取对象上的属性有报错的可能？Promise有很多实现（bluebird，Q等），Promises/A+只是一个规范，大家都按此规范来实现Promise才有可能通用，因此所有出错的可能都要考虑到，假设另一个人实现的Promise对象使用Object.defineProperty()恶意的在取值时抛错，我们可以防止代码出现Bug。

此时，如果对象中有then，且then是函数类型，就可以认为是一个Promise对象，之后，使用x作为this来调用then方法。

如果then是个函数，那么就在x的环境下调用它

```javascript
//其他代码略...
if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    //可能是个对象或是函数
    try {
        let then = x.then; 
        if (typeof then === 'function') {
            //then是function，那么执行Promise
            then.call(x, (y) => {
                resolve(y);
            }, (r) => {
                reject(r);
            });
        } else {
            resolve(x);
        }
    } catch (e) {
        reject(e);
    }

} else {
    //否则是个普通值
    resolve(x);
}
```

这样链式写法就基本完成了。但是还有一种极端的情况，如果Promise对象转为成功态或是失败时传入的还是一个Promise对象，此时应该继续执行，直到最后的Promise执行完。

```javascript
p.then(data => {
    return new Promise((resolve,reject)=>{
        //resolve传入的还是Promise
        resolve(new Promise((resolve,reject)=>{
            resolve(2);
        }));
    });
})
```

此时就要使用递归操作了。

很简单，把调用resolve改写成递归执行resolvePromise方法即可，这样直到解析Promise成一个普通值才会终止，即完成此规范：

```javascript
//其他代码略...
if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    //可能是个对象或是函数
    try {
        let then = x.then; 
        if (typeof then === 'function') {
            let y = then.call(x, (y) => {
                //递归调用，传入y若是Promise对象，继续循环
                resolvePromise(promise2, y, resolve, reject);
            }, (r) => {
                reject(r);
            });
        } else {
            resolve(x);
        }
    } catch (e) {
        reject(e);
    }

} else {
    //是个普通值，最终结束递归
    resolve(x);
}
```

到此，链式调用的代码已全部完毕。在相应的地方调用resolvePromise方法即可。

最后的最后
其实，写到此处Promise的真正源码已经写完了，但是距离100分还差一分，是什么呢？

规范中说明，Promise的then方法是异步执行的。


ES6的原生Promise对象已经实现了这一点，但是我们自己的代码是同步执行，不相信可以试一下，那么如何将同步代码变成异步执行呢？可以使用setTimeout函数来模拟一下：

```javascript
setTimeout(()=>{
    //此入的代码会异步执行
},0);
```

利用此技巧，将代码then执行处的所有地方使用setTimeout变为异步即可，举个栗子：

```javascript
setTimeout(() => {
    try {
        let x = onFulfilled(value);
        resolvePromise(promise2, x, resolve, reject);
    } catch (e) {
        reject(e);
    }
},0);
```

好了，现在已经是满分的Promise源码了

### 一份完整的源码:

```javascript
function Promise(executor) {
	let self = this
	this.status = 'pending' //当前状态
	this.value = undefined  //存储成功的值
	this.reason = undefined //存储失败的原因
	this.onResolvedCallbacks = []//存储成功的回调
	this.onRejectedCallbacks = []//存储失败的回调
	function resolve(value) {
	  if (self.status == 'pending') {
	    self.status = 'resolved'
	    self.value = value
	    self.onResolvedCallbacks.forEach(fn => fn());
	  }
	}
	function reject(error) {
	  if (self.status == 'pending') {
	    self.status = 'rejected'
	    self.reason = error
	    self.onRejectedCallbacks.forEach(fn => fn())
	  }
	}
	try {
	  executor(resolve, reject)
	} catch (error) {
	  reject(error)
	}
}

//实现then方法
Promise.prototype.then = function (infulfilled, inrejected) {
	let self = this
	let promise2
	infulfilled = typeof infulfilled === 'function' ? infulfilled : function (val) {
	  return val
	}
	inrejected = typeof inrejected === 'function' ? inrejected : function (err) {
	  throw err
	}
	if (this.status == 'resolved') {
	  promise2 = new Promise(function (resolve, reject) {
	    //x可能是一个promise，也可能是个普通值
	    setTimeout(function () {
	      try {
	        let x = infulfilled(self.value)
	        resolvePromise(promise2, x, resolve, reject)
	      } catch (err) {
	        reject(err)
	      }
	    });
	
	  })
	}
	if (this.status == 'rejected') {
	
	  promise2 = new Promise(function (resolve, reject) {
	    //x可能是一个promise，也可能是个普通值
	    setTimeout(function () {
	      try {
	        let x = inrejected(self.reason)
	        resolvePromise(promise2, x, resolve, reject)
	      } catch (err) {
	        reject(err)
	      }
	    });
	  })
	}
	if (this.status == 'pending') {
	  promise2 = new Promise(function (resolve, reject) {
	    self.onResolvedCallbacks.push(function () {
	      //x可能是一个promise，也可能是个普通值
	      setTimeout(function () {
	        try {
	          let x = infulfilled(self.value)
	          resolvePromise(promise2, x, resolve, reject)
	        } catch (err) {
	          reject(err)
	        }
	      });
	    })
	    self.onRejectedCallbacks.push(function () {
	      //x可能是一个promise，也可能是个普通值
	      setTimeout(function () {
	        try {
	          let x = inrejected(self.reason)
	          resolvePromise(promise2, x, resolve, reject)
	        } catch (err) {
	          reject(err)
	        }
	      });
	    })
	  })
	}
	return promise2
}
function resolvePromise(p2, x, resolve, reject) {
	if (p2 === x && x != undefined) {
	  reject(new TypeError('类型错误'))
	}
	//如果是个对象，则可能是promise,看下对象中是否有then方法，如果有~那就是个promise
	if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
	  try {//为了防止出现 {then:11}这种情况,需要判断then是不是一个函数
	    let then = x.then
	    if (typeof then === 'function') {
	    	//由于x是一个Promise对象，因此需要在x上执行上面执行的then方法
	    	//使用y暂存上一次递归中
	      then.call(x, function (y) {
	        //y 可能还是一个promise,那就再去解析，直到返回一个普通值为止
	        //这里理解这个Y是怎么来的，很关键，后文中介绍
	        //递归执行resolvePromise
	        resolvePromise(p2, y, resolve, reject)
	      }, function (err) {
	        reject(err)
	      })
	    } else {//如果then不是function 那可能是普通对象
	      resolve(x)
	    }
	  } catch (e) {
	    reject(e)
	  }
	} else {//说明是一个普通值
	//实现值的穿透
	  resolve(x)
	}
}
```
### 深入理解终极解决链式调用的原理（个人理解，偏硬核，可能并不正确）

实现链式调用的核心实现代码，有一个地方很重要：

```javascript
let then = x.then
if (typeof then === 'function') {
	//由于x是一个Promise对象，因此需要在x上执行上面执行的then方法
  then.call(x, function (y) {
    //y 可能还是一个promise,那就再去解析，直到返回一个普通值为止
    //这里理解这个Y是怎么来的，很关键，后文中介绍
    //递归执行resolvePromise
    resolvePromise(p2, y, resolve, reject)
  }, function (err) {
    reject(err)
  })
}
```
可以看到，如果x是一个Promise对象，那么就会手动调用这个x的then()方法，在then方法里递归调用 resolvePromise

关键是，我们虽然看到then里面递归调用了resolvePromise， 而且由y决定递归终点。
那么疑问就来了：我这里调用的then方法到底干了什么，我传入的匿名函数里的y又是怎么来的，它是怎么就能够控制了整个递归终点的

我们回到then方法本身：

```javascript
Promise.prototype.then = function(infulfilled, inrejected){
	//...
	let self = this
	let x = infulfilled(self.value)
	//...
}
```
```javascript
function (y){
	resolcePromise(p1, y, res, rej)
}
```
看出问题了吗？
是的，我们在调用x的then方法时，传入的是一个匿名带参函数
而then方法里面最终会使用self.value传参给infulfilled
**所以很显然，用于判断递归终点的y， 也就是resolvePromise的第二个参数，实际上来源于x里的value值！！！**
于是，这里调用then方法的目的，**实际上就是为了获取x.value**


于是我们追根溯源，来到resolcePromise函数的递归终点，看看是什么东西：

![](/images/assets/20200303120111507.png)
没错，两个resolve

我们继续顺藤摸瓜，来到Promise里的resolve函数：
![](/images/assets/20200303120228153.png)
resolve改变的，就是value值
看到这，一切都明朗了。**简单来说就是，当x是一个普通值时， 直接使用resolve改变顶层Promise对象的value；否则，通过调用x的then方法获取x内部的resolve的参数，并将这个值作为一个新的x进行递归，直到x的value值是一个普通值为止**

**y = x.value = x里面resolve的参数值**


直观点理解，直接上个例子吧：

```javascript
new Promise(function(resolve, reject){
	resolve(2)
})
.then(function(data){
    return new Promise(function(resolve, reject){
        resolve(new Promise(function(resolve, reject){
            resolve(new Promise(function(resolve, reject){
                resolve(8)
            }))
        }))
    })
})
.then(function(a){
    console.log(a)
})
```
对于上面这个例子，我们一步一步分析

上面new了四个Promise，我们分别取名promise1、2、3、4

三个Promise被new出来之后，各自构造函数里的resolve的参数，就是各个Promise对象的value值，所以各个value是这样的
promise1.value = 2
promise2.value = promise3
promise3.value = promise4
promise4.value = 8

当promise1的then方法被调用时，递归工作便开始了
1. 第一次，resolvePromise(p2, promise2, re,rj)。可见promise2是个Promise对象，则调用他的then方法，通过y参数获取到promise2.value的值为promise3，不是普通值，继续递归调用
2. 第二次， resolvePromise(p2, promise3, rs, rj)。可见promise3是个Promise对象，则调用他的then方法，通过y参数获取到promise3.value的值为promise4，不是普通值，继续递归调用
3. 第三次，resolvePromise(p2, promise4, re,rj)。可见promise4是个Promise对象，则调用他的then方法，通过y参数获取到promise4.value的值为8，不是普通值，继续递归调用
4. 第四次，resolvePromise(p2, 8, re,rj)。传入的第二个参数变成了8，到达递归终点，**由resolvePromise调用resolve(8)**———注意，这里和promise4里的resolve(8)不是同一个语句，两者作用都不一样。设置**promise1.value**的值变为8
5. 输出8

总结一下这个步骤：

- resolvePromise通过调用then方法，**获取内部resolve的参数的值进行递归**
- promise1的then方法返回promise2
- promise2的then方法返回promise3
- promise3的then方法返回promise4
- promise4的then方法返回8.

## Promise.all()
这个方法用于将多个Promise实例包装成为一个新的Promise实例

```php
var p = Promise.all([p1, p2, p3])
```
p的状态由p1，p2，p3决定，分成两种情况：
1. 只有p1，p2，p3的状态都变成Fulfilled，p的状态才会变成Fulfilled，此时p1，p2，p3返回的额值组成一个数组，传递给p的回调函数
2. 只要p1， p2，p3有一个被Rejected，p的状态就变为Rejected，第一个Rejected的实例的返回值会传递给p的回调函数

## Promise.race()

```javascript
var p = Promise.race([p1, p2, p3])
```

这个方法中，只要p1, p2, p3有一个率先改变了状态，p的状态就会跟着改变，那个率先改变的Promise实例的返回值就传递给p的回调函数



# 生成器Generator
在1中，我们确定了用回调表达异步流程的两个关键问题：

- 回调地狱
- 控制反转

在2中，我们详细介绍了Promise是如何把回调的控制反转又反转过来，恢复了可信任性。

现在，我们把注意力转移到一种顺序、看似同步的异步流程控制表达风格，这就是ES6中的生成器（Gererator）。

## 可迭代协议
可迭代协议运行JavaScript对象去定义或定制它们的迭代行为，例如（定义）在一个for…of结构中什么值可以被循环（得到）。以下内置类型都是内置的可迭代对象并且有默认的迭代行为：
- Array
- Map
- Set
- String
- TypedArray
- 函数的Arguments对象
- NodeList对象

为了变成可迭代对象，一个对象必须实现@@iterator方法，意思是这个对象（或者它原型链prototype chain上的某个对象）必须有一个名字是**Symbol.iterator**的属性：
![](/images/assets/20200303165609363.png)
当一个对象需要被迭代的时候（比如开始用于一个for…of循环中），它的@@iterator方法被调用并且无参数，然后返回一个用于在迭代中获得值的迭代器。

## 迭代器
迭代器（Iterator）是一种接口，为各种不同的数据结构提供统一的访问机制。任何数据结构，只要部署了Iterator接口，皆可以完成遍历操作

过程如下：

- 创建一个指针对象，指向当前数据结构的起始位置，也就是说遍历器实质上是一个指针 
- 第一次调用指针对象的next方法，将指针指向数据结构第一个成员
- 第二次调用指针对象的next方法，指针指向数据结构的第二个成员
- 不断调动，直到它指向数据结构的最后一个成员

这是一个使用迭代器的例子：

```javascript
var str = 'hello';

// 可迭代协议使用for...of访问
typeof str[Symbol.iterator];    // 'function'

for (var s of str) {
    console.log(s);    // 分别打印 'h'、'e'、'l'、'l'、'o'
}

// 迭代器协议next方法
var iterator = str[Symbol.iterator]();

iterator.next();    // {value: "h", done: false}
iterator.next();    // {value: "e", done: false}
iterator.next();    // {value: "l", done: false}
iterator.next();    // {value: "l", done: false}
iterator.next();    // {value: "o", done: false}
iterator.next();    // {value: undefined, done: true}
```

## 用Generator实现异步
### 简介
Generator函数从语法上，可以理解为一个状态机，封装了多个内部状态

执行Generator函数会返回一个遍历器对象，也就是说，Generator不仅是一个状态机，还是一个遍历器对象生成函数，返回的遍历器对象可以一次遍历Generator函数内部的每一个状态

Generator函数就是一个普通函数，但是有两个特征：

- function命令与函数名之间有个 * 号，
- 函数体内部使用yield语句定义状态

```javascript
function * newGenerator(){
	yield 'hello'
	yield 'world'
	return 'end'
}
```
这个函数内部有两个yield语句，所以该函数有三个状态，hello,world, return 

Generator函数调用和普通函数一样，都是在函数名后加上一对圆括号，不同的是，调用Generator函数之后，函数并不会立即执行，也不会返回运行结果，而是返回一个指向内部状态的指针对象，这个对象，就是Iterator对象。

下一步，必须调用遍历器对象的next方法，使指针移动到对象的next方法上，每次调用next方法，内部指针就会从函数头部或上一次停下来的地方继续执行，知道遇到下一条yield语句。
换句话说，Generator函数是分段执行的，yield是暂停执行的标记，而next方法可以恢复执行

### yield语句
- 遇到yield语句就暂停执行以后的操作，必将紧跟在yield后面的表达式作为值返回
- 下一次调用next时继续往下执行，直到遇到下一条yield语句
- 如果没有遇到新的yield语句，就一直运行到函数结束，直到return
- 如果函数没有return，则返回对象的value属性为undefine

### 用法
用Generator改写上面回调嵌套的例子.

```javascript
//获取code
let getKeyPromise = function () {
    return new Promsie(function (resolve, reject) {
       wx.login({
		 success(res) {
		 //第一层回调,调用wx.login接口
		    if (res.code) {
		    	it.next(res.code)
		    }
		  }
		})
    });
};
//获取session_ket
let getTokenPromise = function (key) {
    return new Promsie(function (resolve, reject) {
        $.ajax({
            type: 'get',
            url: 'http://localhost:3000/getToken',
            data: {
                code: key
            },
            success: function (res) {
                it.next(res.code)         
            },
            error: function (err) {
                console.log(err)
            }
        });
    });
};
//获取业务数据
let getDataPromise = function (data) {
    return new Promsie(function (resolve, reject) {
        $.ajax({
            type: 'get',
            url: 'http://localhost:3000/getData',
            data: {
                session_key: data,
            },
            success: function (res) {
                it.next(res.session_key)         
            },
            error: function (err) {
                console.lgo(err)
            }
        });
    });
};


function * main(){
	let code = yield getKeyPromise()
	let session_key = yield getTokenPromise(code)
	let data = yield getDataPromise(session_key);
	console.log('业务数据' + data)
}
//生成迭代器实例
let it = main()
//开始运行
it.next()

//这里是主线程，不会被影响
console.log(666)
```

注意：如果我们一直占用JavaScript主线程的话，是没有时间去执行任务队列中的任务

```javascript
// 运行第一步
it.next();

// 持续占用JavaScript主线程
while(1) {};    // 这里是拿不到异步数据的，因为没有机会去任务队列里取任务执行

```

# Async/Await
上面我们介绍了Promise和Generator，把这两者结合起来，就是Async/Await。

Generator的缺点是还需要我们手动控制next()执行，使用Async/Await的时候，只要await后面跟着一个Promise，它会自动等到Promise决议以后的返回值，resolve(…)或者reject(…)都可以。

```javascript
//获取code
let getKeyPromise = function () {
    return new Promsie(function (resolve, reject) {
       wx.login({
		 success(res) {
		 //第一层回调,调用wx.login接口
		    if (res.code) {
		    	resolve(res.code)
		    }
		  }
		})
    });
};
//获取session_ket
let getTokenPromise = function (key) {
    return new Promsie(function (resolve, reject) {
        $.ajax({
            type: 'get',
            url: 'http://localhost:3000/getToken',
            data: {
                code: key
            },
            success: function (res) {
                resolve(res.session_key);         
            },
            error: function (err) {
                reject(err);
            }
        });
    });
};
//获取业务数据
let getDataPromise = function (data) {
    return new Promsie(function (resolve, reject) {
        $.ajax({
            type: 'get',
            url: 'http://localhost:3000/getData',
            data: {
                session_key: data,
            },
            success: function (res) {
                resolve(res.userinfo);         
            },
            error: function (err) {
                reject(err);
            }
        });
    });
};

async function main () {
    let code = await getKeyPromise();
    let session_key = await getTokenPromise(code);
    let busiData = await getDataPromise(session_key);
    console.log('业务数据：', busiData);
}

main();
```
可以看到，使用Async/Await，完全就是同步的书写方式，逻辑和数据依赖都非常清楚，只需要把异步的东西用Promise封装出去，然后使用await调用就可以了，也不需要像Generator一样需要手动控制next()执行。

Async/Await是Generator和Promise的组合，完全解决了基于回调的异步流程存在的两个问题，可能是现在最好的JavaScript处理异步的方式了。

# 参考
[JavaScript的异步编程](https://blog.liuxuan.site/2018/07/20/javascript_asynchronous_programming/)
