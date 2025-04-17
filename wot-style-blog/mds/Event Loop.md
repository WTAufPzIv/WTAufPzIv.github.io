---
date: 2020-02-26
categories: [技术,前端,HTML、浏览器综合]
thumbnail: /images/fe/eventloop.jpg
toc: true
---

# 序言
## 进程与线程
本质上讲，进程和线程都是对于CPU 工作时间片的一个描述
进程就是对程序动态执行的描述， 线程是进程中的更小单位，描述了执行一段指令所需的时间

> 把这些概念拿到浏览器中来说，当你打开一个 Tab 页时，其实就是创建了一个进程，一个进程中可以有多个线程，比如渲染线程、JS 引擎线程、HTTP 请求线程等等。当你发起一个请求时，其实就是创建了一个线程，当请求结束后，该线程可能就会被销毁

JavaScript 是一门 单线程语言，即同一时间只能执行一个任务，即代码执行是**同步并且阻塞**的。这一点很好理解，例如浏览器内核的渲染引擎和JS引擎，在执行过程中渲染线程和JS线程就是互斥的

这其中的原因是因为 JS 可以修改 DOM，如果在 JS 执行的时候 UI 线程还在工作，就可能导致不能安全的渲染 UI。这其实也是一个单线程的好处，得益于 JS 是单线程运行的，可以达到节省内存，节约上下文切换时间，没有锁的问题的好处

但是，只能同步执行在实际应用中肯定是有问题的，所以 JS 有了一个用来实现异步的函数：**setTimeout**
而Event Loop 就是为了确保 **异步代码** 可以在 **同步代码** 执行后继续执行的。

<!--more-->

# 调用栈（Call Stack）
顾名思义，调用栈本身就是一个栈，只不过栈里面装的是一个个待执行的函数

Event Loop 会一直检查 Call Stack 中是否有函数需要执行，如果有，就从栈顶依次执行。同时，如果执行的过程中发现其他函数，继续入栈然后执行。

举个例子，函数A调用函数B

 1. 栈空
 2. 执行函数A，函数A入栈
 3. 函数A执行函数B，函数B入栈
 4. 函数B执行完毕，出栈
 5. 函数A执行完毕，出栈
 6. 栈空



对于下面这个代码：

```javascript
const bar = () => console.log('bar')
const baz = () => console.log('baz')
const foo = () => {
	console.log('foo')
	bar()
	baz()
}
```
这段代码在 调用栈中的运行顺序如下图：
![](/images/assets/2020022610324171.png)
当我们使用递归的时候，因为栈可存放的函数是有限制的，一旦存放了过多的函数且没有得到释放的话，就会出现爆栈的问题

```ruby
function bar() {
  bar()
}
bar()
```

对于同步执行的代码，其在运行时候的机制可以用调用栈来解释，而对于异步执行的代码，例如一次网络请求，setTimeout函数，或者其他一些由于耗时长而需要异步执行的代码，这时就要引出 **事件表格（Event Table）** 和 **事件队列 (Event Queue)** 了

# Event Table
Event Table 可以理解成一张 **事件->回调函数** 对应表
它就是用来存储 JavaScript 中的异步事件 (request, setTimeout, IO等) 及其对应的回调函数的列表

# Event Queue
Event Queue 简单理解就是 回调函数 队列，所以它也叫 Callback Queue
当 Event Table 中的事件被触发，事件对应的 回调函数 就会被 push 进这个 Event Queue，然后等待被执行

# Event Loop（浏览器）
了解了这些，就开始进入主题。首先来看一张图
![](/images/assets/20200226112858662.png)
这个图要表达的内容用文字来表述的话：

- 同步和异步任务分别进入不同的执行"场所"，同步的进入主线程，异步的进入Event Table并注册函数。
- 当指定的事情完成时，Event Table会将这个函数移入Event Queue。
- 主线程内的任务执行完毕为空，会去Event Queue读取对应的函数，进入主线程执行。
- 上述过程会不断重复，也就是常说的Event Loop(事件循环)。

> 我们不禁要问了，那怎么知道主线程执行栈为空啊？js引擎存在monitoring process进程，会持续不断的检查主线程执行栈是否为空，一旦为空，就会去Event Queue那里检查是否有等待被调用的函数。

如果上面的调用栈是一个银行窗口，任务队列中的回调函数是一个个排队办业务的人，那么 Event Loop 就是叫号系统！Event Loop 的唯一任务就是 连接任务队列和调用栈：

它不停检查 **调用栈** 中是否有任务需要执行，如果没有，就检查 **任务队列**，从中弹出一个任务，放入调用栈中，如此往复循环。

理解了这个之后，来看一个很常见的网络请求的栗子：

```javascript
let data = [];
$.ajax({
    url:www.javascript.com,
    data:data,
    success:() => {
        console.log('发送成功!');
    }
})
console.log('代码执行结束');
```
稍微有点开发经验的读者应该都知道，这段代码会先输出“代码执行结束”，再输出“发送成功”。因为对于上述代码，有如下执行流程：
- ajax进入Event Table，注册回调函数success。
- 执行console.log('代码执行结束')。
- ajax事件完成，回调函数success进入Event Queue。
- 主线程从Event Queue读取回调函数success并执行。

再来看一个setTimeout的栗子：

```javascript
const foo = () => console.log("First");
const bar = () => setTimeout(() => console.log("Second"), 500);
const baz = () => console.log("Third");

bar();
foo();
baz();
```
- 我们调用了函数 bar。bar 返回了一个 setTimeout 函数。
- setTimeout 中的回调函数被添加到 Web API，setTimeout 函数和 bar 调用完成被从调用栈弹出。
- 定时器开始，同时函数 foo 被调用，打印出 First
- 函数 baz 被调用，打印出 Third。
- 500ms 定时器结束，回调函数被放入任务队列，Event Loop 检查到调用栈是空的，所以将其取出放在调用栈。
- 回调函数被执行，打印出 Second。
![](/images/assets/20200226115754930.gif)
## 重新认识setTimeout
根据上面的例子和前文的叙述我们知道，由于javascript是并将永远是单线程任务，因此为了实现非阻塞，JS提供了诸如setTimeout一类的实现异步非阻塞的WebApi函数。因此对于setTimeout给人的第一映像是延迟执行代码，但实际上它最大的作用是实现异步非阻塞

```javascript
setTimeout(() => {
    console.log('延时3秒');
},3000)
```
渐渐的setTimeout用的地方多了，终于问题也出现了，有时候明明写的延时3秒，实际却5，6秒才执行函数，这又咋回事啊

```javascript
setTimeout(() => {
    console.log('666')
},3000)

sleep(10000000)
```
在浏览器执行这段代码，发现要远远超过三秒之后才会打印出666
- task()进入Event Table并注册,计时开始。
- 执行sleep函数，很慢，非常慢，计时仍在继续。
- 3秒到了，计时事件timeout完成，task()进入Event Queue，但是sleep也太慢了吧，还没执行完，只好等着。
- sleep终于执行完了，task()终于从Event Queue进入了主线程执行。

这个时候就要结合上文所讲的栗子，重新认识setTimeout：**经过指定时间后，把要执行的任务(本例中为console.log)加入到EventQueue中，不是经过指定的时间立即执行**，上述代码中，如果在同步代码部分执行了一些比较复杂的操作和运算，也会导致真正的延迟时间大于3秒

那么如果说setTimeout函数设置延迟时间为0，且执行栈为空呢?
答案是：**即便主线程为空，0毫秒实际上也是达不到的。根据HTML的标准，最低是4毫秒**

## setInterval
上面说完了setTimeout，当然不能错过它的孪生兄弟setInterval。他俩差不多，只不过后者是循环的执行。对于执行顺序来说，setInterval会**每隔指定的时间将注册的函数置入Event Queue**，如果前面的任务耗时太久，那么同样需要等待。
唯一需要注意的一点是，对于setInterval(fn,ms)来说，我们已经知道**不是每过ms秒会执行一次fn，而是每过ms秒，会有fn进入Event Queue**。一旦setInterval的回调函数fn执行时间超过了延迟时间ms，**那么就完全看不出来有时间间隔了， 仿佛setInterval函数失效了一样**。这句话你品！你细品！！！基本上就是Event Queue入队速度与出队速度之间的关系，以我的理解，当入队速度远小于出队速度，那么就会有时间间隔的感觉，否则就没有。


## 宏队列和微队列
宏队列，macrotask，也叫**tasks**。 一些异步任务的回调会依次进入macro task queue，等待后续被调用，这些异步任务包括：

- setTimeout
- setInterval
- setImmediate (Node独有)
- requestAnimationFrame (浏览器独有)
- I/O
- UI rendering (浏览器独有)

微队列，microtask，也叫**jobs**。 另一些异步任务的回调会依次进入micro task queue，等待后续被调用，这些异步任务包括：

- process.nextTick (Node独有)
- Promise
- Object.observe
- MutationObserver

所以正确的一次 Event loop 顺序是这样的
![](/images/assets/20200226164721232.png)
1. 执行同步代码，这属于宏任务
2. 执行栈为空，查询是否有微任务需要执行
3. 执行所有微任务
4. 必要的话渲染 UI
5. 然后开始下一轮 Event loop，执行宏任务中的异步代码

> 通过上述的 Event loop 顺序可知，如果宏任务中的异步代码有大量的计算并且需要操作 DOM
> 的话，为了更快的响应界面响应，我们可以把操作 DOM 放入微任务中


最后上一个完整且比较复杂的例子

```javascript
console.log('1');

setTimeout(function() {
    console.log('2');
    process.nextTick(function() {
        console.log('3');
    })
    new Promise(function(resolve) {
        console.log('4');
        resolve();
    }).then(function() {
        console.log('5')
    })
})
process.nextTick(function() {
    console.log('6');
})
new Promise(function(resolve) {
    console.log('7');
    resolve();
}).then(function() {
    console.log('8')
})

setTimeout(function() {
    console.log('9');
    process.nextTick(function() {
        console.log('10');
    })
    new Promise(function(resolve) {
        console.log('11');
        resolve();
    }).then(function() {
        console.log('12')
    })
})

```
第一轮事件循环流程分析如下：
- 整体script作为第一个宏任务进入主线程，遇到console.log，输出1。
- 遇到setTimeout，其回调函数被分发到宏任务Event Queue中。我们暂且记为setTimeout1。
- 遇到process.nextTick()，其回调函数被分发到微任务Event Queue中。我们记为process1。
- 遇到Promise，new Promise直接执行，输出7。then被分发到微任务Event Queue中。我们记为then1。
- 又遇到了setTimeout，其回调函数被分发到宏任务Event Queue中，我们记为setTimeout2。
![](/images/assets/20200226165203159.png)
上表是第一轮事件循环宏任务结束时各Event Queue的情况，此时已经输出了1和7。

我们发现了process1和then1两个微任务。
执行process1,输出6。
执行then1，输出8。

**好了，第一轮事件循环正式结束，这一轮的结果是输出1，7，6，8。那么第二轮时间循环从setTimeout1宏任务开始：**

- 首先输出2。接下来遇到了process.nextTick()，同样将其分发到微任务Event Queue中，记为process2。new Promise立即执行输出4，then也分发到微任务Event Queue中，记为then2。
![](/images/assets/20200226165440776.png)
- 第二轮事件循环宏任务结束，我们发现有process2和then2两个微任务可以执行。
- 输出3。输出5。
**第二轮事件循环结束，第二轮输出2，4，3，5。**
- 第三轮事件循环开始，此时只剩setTimeout2了，执行。直接输出9。
- 将process.nextTick()分发到微任务Event Queue中。记为process3。
- 直接执行new Promise，输出11。
- 将then分发到微任务Event Queue中，记为then3。
![](/images/assets/20200226165609254.png)
- 第三轮事件循环宏任务执行结束，执行两个微任务process3和then3。
- 输出10。输出12。
**第三轮事件循环结束，第三轮输出9，11，10，12。**

整段代码，共进行了三次事件循环，完整的输出为1，7，6，8，2，4，3，5，9，11，10，12。(请注意，node环境下的事件监听依赖libuv与前端环境不完全相同，输出顺序可能会有误差)

# Event Loop（NodeJS）
![](/images/assets/20200301172249293.png)
timer

- timers 阶段会执行 setTimeout 和 setInterval
- 一个 timer 指定的时间并不是准确时间，而是在达到这个时间后尽快执行回调，可能会因为系统正在执行别的事务而延迟

I/O

- I/O 阶段会执行除了 close 事件，定时器和 setImmediate 的回调

poll
- poll 阶段很重要，这一阶段中，系统会做两件事情
执行到点的定时器
执行 poll 队列中的事件
- 并且当 poll 中没有定时器的情况下，会发现以下两件事情
如果 poll 队列不为空，会遍历回调队列并同步执行，直到队列为空或者系统限制
如果 poll 队列为空，会有两件事发生
如果有 setImmediate 需要执行，poll 阶段会停止并且进入到 check 阶段执行 setImmediate
如果没有 setImmediate 需要执行，会等待回调被加入到队列中并立即执行回调
如果有别的定时器需要被执行，会回到 timer 阶段执行回调。

check
- check 阶段执行 setImmediate

close callbacks
- close callbacks 阶段执行 close 事件

并且在 Node 中，有些情况下的定时器执行顺序是随机的