---
date: 2020-04-08
categories: [技术,前端,React]
thumbnail: /images/fe/state.jpg
toc: true
---
# 流程图
![](/images/assets/20200408101054790.png)
<!--more-->
- partialState：setState传入的第一个参数，对象或函数
- _pendingStateQueue：当前组件等待执行更新的state队列
- isBatchingUpdates：react用于标识当前是否处于批量更新状态，所有组件公用
- dirtyComponent：当前所有处于待更新状态的组件队列
- transcation：react的事务机制，在被事务调用的方法外包装n个waper对象，并一次执行：waper.init、被调用方法、waper.close
- FLUSH_BATCHED_UPDATES：用于执行更新的waper，发起组件更新。只有一个close方法



# 两类setState
1、批量更新类：即react内部的执行函数，执行setState的执行逻辑，都是批量更新处理，其中包括：react内部事件(合成事件)和生命周期；

2、非批量更新类：即上面两种情况以外的情况，经常见到的：原生事件、setTimeout、fetch等等；

先说明两个概念：

**1、事务：**
可以理解为，一个正常的函数外层又被包裹了一层。这层包裹处理，包括一个或多个的函数执行前的处理函数(initialize函数)、一个和多个函数执行后的处理函数(close函数)；React很多的逻辑处理，都使用了事务的概念；

**2、合成事件和原生事件的关系和区别**：

区别：原生事件就是addEventListener写法的事件！而合成事件，就是直接书写react中的onClick、onChange等；

关系：合成事件可以理解为react对原生事件的包裹封装；原生事件相当于上面事务概念中的正常的函数，而经过包装处理形成的事务，就是react中的合成事件。
.
对于两种情况下的setState有两种不同的执行顺序：
![](/images/assets/20200408101439807.png)


对于批量更新分支，大概的流程如下

1.将setState传入的partialState参数存储在当前组件实例的state暂存队列中。
2.判断当前React是否处于批量更新状态，如果是，将当前组件加入待更新的组件队列中。
3.如果未处于批量更新状态，将批量更新状态标识设置为true，用事务再次调用前一步方法，保证当前组件加入到了待更新组件队列中。
4.调用事务的waper方法，关闭批量更新，发起组件更新。遍历待更新组件队列依次执行更新。
5.执行生命周期componentWillReceiveProps。
6.将组件的state暂存队列中的state进行合并，获得最终要更新的state对象，并将队列置为空。
7.执行生命周期componentShouldUpdate，根据返回值判断是否要继续更新。
8.执行生命周期componentWillUpdate。
9.执行真正的更新，render。
10.执行生命周期componentDidUpdate。

# 总结
## 在合成事件和生命周期中
在react的生命周期和合成事件中，react仍然处于他的更新机制中，这时isBranchUpdate为true。

按照上述过程，这时无论调用多少次setState，都会不会执行更新，而是将要更新的state存入_pendingStateQueue，将要更新的组件存入dirtyComponent。

当上一次更新机制执行完毕，以生命周期为例，所有组件，即最顶层组件didmount后会将isBranchUpdate设置为false。这时将执行之前累积的setState。

## 在原生事件和异步函数中
由执行机制看，setState本身并不是异步的，而是如果在调用setState时，如果react正处于更新过程，当前更新会被暂存，等上一次更新执行后在执行，这个过程给人一种异步的假象。

在生命周期，根据JS的异步机制，会将异步函数先暂存，等所有同步代码执行完毕后在执行，这时上一次更新过程已经执行完毕，isBranchUpdate被设置为false，根据上面的流程，这时再调用setState即可立即发起更新，拿到更新结果。

## partialState合并机制
如果传入的是对象，很明显会被合并成一次：

```javascript
Object.assign(
  nextState,
  {index: state.index+ 1},
  {index: state.index+ 1}
)
```
如果传入的是函数，函数的参数preState是前一次合并后的结果，所以计算结果是准确的
![](/images/assets/20200408105427926.png)
## 关于callback
我们知道setState可以给第二个参数传递一个函数，用作回调函数。这个回调函数在批量更新下也是会进行收集，收集的时间点和state一样。收集之后会在后续的组件reRender之后进行统一执行
