---
date: 2020-04-08
categories: [技术,前端,React]
thumbnail: /images/fe/smzq.jpg
toc: true
---
# 生命周期大体流程
<!--more-->
![](/images/assets/2020040809211911.png)
# 初始化步骤
初始进入页面 → constructor → componentWillMount → render → componentDidMount → componentWillUnmount；

>下面的图中，加了一些的状态说明，提前说明一下：_compositeLifeCycleState翻译为：综合生命周期状态(下文简称：生命状态)，它是生命周期中关键的状态，setState是否出发更新，就是依据它的状态

![](/images/assets/20200408092256780.png)

1、首先，进入页面，会初始化页面数据(state, props, context等…)，等待备用；

2、然后，设置生命状态为：MOUNTING，这个状态下面会说明它的用途，这里我们先按照流程继续往下走；

3、接下来，在componentWillMount中，setState操作，只是把state合并到初始化状态中，**而根本不会触发render** ；在这里更新state，就等同于直接写在this.state中，所以，在此生命周期中的setState根本没有意义；

4、执行到这里，生命状态会被重置为 null，之后是渲染页面(即执行render)；

5、最后，渲染完以后，执行componentDidMount，这里使用setState即会正常触发重新渲染了，更新state。(接下来，就是更新流程了！！)

# 更新
>setState发起更新流程，并不是每个生命周期中的setState都会触发跟新，它判断的依据就是 _compositeLifeCycleState ，上面说到的MOUNTING和下面将会讲到的RECEIVE_PROPS，在这两个状态下，react会处理setState为不会触发更新，相对的其他状态会正常更新；这也导致了一些生命周期中的使用情况

![](/images/assets/20200408092501528.png)
1、首先，react会比较前后元素、状态等是否不同，如果不同则正式发起更新；

2、然后，生命状态 被设置为RECEIVE_PROPS(注意：此时生命周期中，setState不会触发更新，而是会做其他处理；

3、接下来，**componentWillReceiveProps中的setState就不会执行更新，而是合并挂载起来，等待render时统一更新**；

4、到这里，生命状态 会重置为null；然后shouldComponentUpdate中会判断是否更新；之后是componentWillUpdate。

<p style="color:rgb(221,81,69);font-size:20px">
注意：shouldComponentUpdate和componentWillUpdate执行的时候，生命状态 已经被重置为null，在它们里面的setState会触发更新，那么在其间使用呢？会造成什么？答案就是：在一个更新周期还没有render之前，再次发起updateComponent，直接导致递归更新死循环，造成浏览器卡死。所以在他们里面🚫禁止🚫使用setState。
</p>

5、最后，渲染页面；再执行componentDidUpdate；它里面执行setState，会触发更新，不同的是render完成之后再发起的reRender。虽然这儿区别于上面两个生命周期中使用的情况，但是会一遍一遍的更新，可以依靠shouldComponentUpdate进行控制

最后呢，简单介绍一下，退出页面的流程。此流程中， 首先生命状态也会被赋予值为UNMOUNTING， 然后执行componentWillUnmount，最后生命状态重置为null，做卸载页面组件和状态等处理。顺便提一下，在componentWillUnmount中使用setStat，因为等待的是页面卸载，所以改变state是没有意义的。

# 异步获取数据
## componentWillMount的问题
在componentWillMount中执行this.setState是不会触发二次渲染的。

它也只会在挂载过程中被调用一次，它的作用和constructor没有太大差异。有很多人在componentWillMount中请求后台数据，认为这样可以更早的得到数据，但是componentWillMout是在render函数执行前执行的，虽然请求是在第一次render之前发送的，但是返回并不能保证在render之前完成。render不会等你慢慢请求。所以当数据到来时组件已经完成首次的渲染，而在这个生命周期当中setState又不会触发reRender，所以会出现请求的数据无法正常渲染。

## componentdidmount的优点
在生产时,componentDidMount生命周期函数是最好的时间去请求数据,其中最重要原因:使用componentDidMount第一个好处就是这个一定是在组件初始化完成之后,再会请求数据,因此不会报什么警告或者错误,我们正常请教数据完成之后一般都会setState.

# 使用总结
生命周期中setState的使用情况：

- 无意义使用：componentWillMount，componentWillUnmount；

- 有条件使用：componentDidUpdate；

- 禁止使用：componentWillUpdate，shouldComponentUpdate；

- 正常使用：componentWIllReceiveProps，componentDidMount。

生命周期中setState是否触发更新：

componentWillMount和componentWillReceiveProps中，setState会被react内部处理，而不触发render；其他生命周期均正常出发更新渲染。

# react V16.4版本生命周期
原来（React v16.0前）的生命周期在React v16推出的Fiber之后就不合适了，因为如果要开启async rendering，在render函数之前的所有函数，都有可能被执行多次。

上文我们已经知道，下面这些生命周期是在render之前执行的：
- componentWillMount
- componentWillReceiveProps
- shouldComponentUpdate
- componentWillUpdate

react V16版本使用的fiber架构中，将上述生命周期归为了同一个阶段：**调和阶段**。调和阶段的生命周期在实际组件的渲染过程中，有一定几率会发生多次调用，这取决于fiber架构当中对于时间片的控制，如果在画面的1帧的时间之内不能快速完成运算，生命周期中执行的JS线程会被打断，优先渲染页面防止页面卡顿。被打断的生命周期会在之后从头执行。

禁止用比劝导开发者不要这样用的效果更好，所以除了shouldComponentUpdate，其他在render函数之前的所有函数（componentWillMount，componentWillReceiveProps，componentWillUpdate）都被getDerivedStateFromProps替代。

## getDerivedStateFromProps
随着getDerivedStateFromProps的推出，同时deprecate了一组生命周期API，包括：
- componentWillReceiveProps
- componentWillMount
- componentWillUpdate


也就是用一个静态函数getDerivedStateFromProps来取代被deprecate的几个生命周期函数，就是强制开发者在render之前只做无副作用的操作，而且能做的操作局限在根据props和state决定新的state

这个getDerivedStateFromProps是一个静态函数，所以函数体内不能访问this，简单说，就是应该一个纯函数，纯函数是一个好东西啊，输出完全由输入决定。

```javascript
static getDerivedStateFromProps(nextProps, prevState) {
  //根据nextProps和prevState计算出预期的状态改变，返回结果会被送给setState
}
```


## getSnapshotBeforeUpdate
React v16.4还具有了一个新的声明周期函数getSnapshotBeforeUpdate，**这函数会在render之后执行，而执行之时DOM元素还没有被更新**，给了一个机会去获取DOM信息，计算得到一个snapshot，这个snapshot会作为componentDidUpdate的第三个参数传入。

```javascript
getSnapshotBeforeUpdate(prevProps, prevState) {
  console.log('#enter getSnapshotBeforeUpdate');
  return 'foo';
}

componentDidUpdate(prevProps, prevState, snapshot) {
  console.log('#enter componentDidUpdate snapshot = ', snapshot);
}
```
上面这段代码可以看出来这个snapshot怎么个用法，snapshot咋看还以为是组件级别的某个“快照”，其实可以是任何值，到底怎么用完全看开发者自己，getSnapshotBeforeUpdate把snapshot返回，然后DOM改变，然后snapshot传递给componentDidUpdate。

官方给了一个例子，用getSnapshotBeforeUpdate来处理scroll，坦白说，我也想不出其他更常用更好懂的需要getSnapshotBeforeUpdate的例子，这个函数应该大部分开发者都用不上



## react 16.4生命周期图
![](/images/assets/20200408114207672.png)
总结一下：
用一个静态函数getDerivedStateFromProps来取代被deprecate的几个生命周期函数，就是强制开发者在render之前只做无副作用的操作，而且能做的操作局限在根据props和state决定新的state，而已。