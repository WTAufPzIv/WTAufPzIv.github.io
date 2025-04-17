---
date: 2020-06-30
categories: [技术,前端,JavaScript]
thumbnail: /images/fe/intersectionobsever.jpg
toc: true
---

文章参考：[IntersectionObserver 和图片懒加载](https://zhuanlan.zhihu.com/p/94426820)
# 关于 IntersectionObserver
IntersectionObserver 这个 API 平常可能听得比较少，caniuse 兼容性报告目前支持率是 90.12%，还不推荐用于大众化的场景中，但是它的能力和性能非常的好。
![](/images/assets/20200629190154149.png)
IntersectionObserver 接口 (从属于Intersection Observer API) 提供了一种异步观察目标元素与其祖先元素或顶级文档视窗(viewport)交叉状态的方法。祖先元素与视窗(viewport)被称为根(root)。由于可见（visible）的本质是，目标元素与视口产生一个交叉区，所以这个 API 叫做"**交叉观察器**"。

<!--more-->

简单点说就是它可以观察 root（默认是视口）和目标元素的交叉情况，当交叉率是 0% 或者 10% 或者更多的时候，可以触发指定的回调。

当一个 IntersectionObserver 对象被创建时，其被配置为监听根中一段给定比例的可见区域。一旦 IntersectionObserver 被创建，则无法更改其配置，所以一个给定的观察者对象只能用来监听可见区域的特定变化值；然而，你可以在同一个观察者对象中配置监听多个目标元素。

## 使用
const observer = new IntersectionObserver(callback, observerConfig)

创建一个新的 IntersectionObserver 对象，当其监听到目标元素的可见部分穿过了一个或多个阈(thresholds)时，会执行指定的回调函数。

使用示例：

```javascript
function cb (entries) {
  console.log(entries)
  entries.forEach(entry => {
    const target = entry.target;
    console.log(target)
    console.log(entry)
  });
}

let observerConfig = {
  root: null,
  rootMargin: '0px',
  threshold: [0],
}

const observer = new IntersectionObserver(cb, observerConfig)
const box = document.getElementById('#box')
// 开始观察
observer.observe(box)
// 停止观察
observer.unobserve(box)
// 关闭观察器，observer 所有的观察都会停止
observer.disconnect();
```
entries 是一个监听目标的数组，每个成员都是一个 **IntersectionObserverEntry 对象**。

cb 回调函数在最初会调用一次，这次 entries 会是**所有的观察目标对象**。而在滑动的时候会把可见性变化符合 threshold 的对象作为 entries 传进来。

## IntersectionObserverEntry对象

```javascript
{
  boundingClientRect: DOMRectReadOnly {x: 8, y: 380, width: 300, height: 300, top: 380, …}
  intersectionRatio: 0.023333333432674408
  intersectionRect: DOMRectReadOnly {x: 8, y: 380, width: 300, height: 7, top: 380, …}
  isIntersecting: true
  rootBounds: DOMRectReadOnly {x: 0, y: 0, width: 1903, height: 387, top: 0, …}
  target: img.lazy
  time: 440149.8099999735
}
```

- time：可见性发生变化的时间，是一个高精度时间戳，单位为毫秒，返回一个记录从 IntersectionObserver 的时间原点(time origin)到交叉被触发的时间的时间戳(DOMHighResTimeStamp).
- target：被观察的目标元素，是一个 DOM 节点对象
- rootBounds：根元素的矩形区域的信息，getBoundingClientRect() 方法的返回值，如果没有根元素（即直接相对于视口滚动），则返回 null
- boundingClientRect：目标元素的矩形区域的信息
- intersectionRect：目标元素与视口（或根元素）的交叉区域的信息
- intersectionRatio：目标元素的可见比例，即 intersectionRect 占 boundingClientRect 的比例，完全可见时为 1，完全不可见时小于等于0
- isIntersecting 是否交叉

## callback参数
目标元素的可见性变化时，就会调用观察器的回调函数callback。

callback一般会触发两次。一次是目标元素刚刚进入视口（开始可见），另一次是完全离开视口（开始不可见）。简单来说，就是可见性发生变化。**不过这取决于option中的threshold**

```javascript
var io = new IntersectionObserver(
	entries => {
		console.log(entries);
	}
);
```
上面代码中，回调函数采用的是箭头函数的写法。callback函数的参数（entries）是一个数组，每个成员都是一个IntersectionObserverEntry对象。举例来说，如果同时有两个被观察的对象的可见性发生变化，entries数组就会有两个成员。

## 配置option
IntersectionObserver构造函数的第二个参数是一个配置对象。它可以设置以下属性。

### threshold 属性
threshold属性决定了什么时候触发回调函数。它是一个数组，每个成员都是一个门槛值，默认为[0]，即交叉比例（intersectionRatio）达到0时触发回调函数。

```javascript
new IntersectionObserver(
	entries => {/* ... */}, 
	{
		threshold: [0, 0.25, 0.5, 0.75, 1]
	}
);
```

用户可以自定义这个数组。比如，[0, 0.25, 0.5, 0.75, 1]就表示当目标元素 0%、25%、50%、75%、100% 可见时，会触发回调函数。
![](/images/assets/20200630170622520.gif)

### root 属性，rootMargin 属性
很多时候，目标元素不仅会随着窗口滚动，还会在容器里面滚动（比如在iframe窗口里滚动）。容器内滚动也会影响目标元素的可见性

IntersectionObserver API 支持容器内滚动。root属性指定目标元素所在的容器节点（即根元素）。注意，容器元素必须是目标元素的祖先节点。

```javascript
var opts = { 
	root: document.querySelector('.container'),
	rootMargin: "500px 0px" 
	};

var observer = new IntersectionObserver(
	callback,
	opts
);
```

上面代码中，除了root属性，还有rootMargin属性。**后者定义根元素的margin，用来扩展或缩小rootBounds这个矩形的大小**，从而影响intersectionRect交叉区域的大小。它使用CSS的定义方法，比如10px 20px 30px 40px，表示 top、right、bottom 和 left 四个方向的值。

这样设置以后，**不管是窗口滚动或者容器内滚动，只要目标元素可见性变化，都会触发观察器**。
![](/images/assets/20200630171748703.gif)

## 注意点
IntersectionObserver API 是异步的，不随着目标元素的滚动同步触发。

规格写明，IntersectionObserver的实现，应该采用requestIdleCallback()，即只有线程空闲下来，才会执行观察器。**这意味着，这个观察器的优先级非常低，只在其他任务执行完，浏览器有了空闲才会执行。**

# 懒加载
## 懒加载的常规实现
常规实现都会监听滚动事件，通过 el.getBoundingClientRect() 获取到当前元素与视口的位置关系来确定图片是否加载，在加载完成之后为了性能考虑，删除 data-src ，这样就可以避免重复的执行，要注意的是 **getBoundingClientRect 会触发浏览器的回流**。

```javascript
img.dataset.src && img.getBoundingClientRect().bottom >= 0 && windowHeight > img.getBoundingClientRect().top
```
- 如果不存在 data-src 则直接跳过（性能优化）；
- 判断元素底部是否出现在视口中，出现则显示；
- 判断元素顶部是否出现在视口中，出现则显示；

## 利用intersectionObserve实现懒加载
通过isIntersecting或者intersectionRatio是否大于0判断元素是否在视窗内，并通过data-src来实现懒加载

```html
<ul class="box">
  <li><img src="http://placehold.it/450x300/caaa8e/ccc.png" data-src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1549272664908&di=4bb90ffd078e31348159c07e78947f0a&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201610%2F08%2F20161008151749_2VAKU.jpeg" alt=""></li>
  <li><img src="http://placehold.it/450x300/caaa8e/ccc.png" data-src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1549272664908&di=4bb90ffd078e31348159c07e78947f0a&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201610%2F08%2F20161008151749_2VAKU.jpeg" alt=""></li>
  <li><img src="http://placehold.it/450x300/caaa8e/ccc.png" data-src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1549272664908&di=4bb90ffd078e31348159c07e78947f0a&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201610%2F08%2F20161008151749_2VAKU.jpeg" alt=""></li>
  <li><img src="http://placehold.it/450x300/caaa8e/ccc.png" data-src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1549272664908&di=4bb90ffd078e31348159c07e78947f0a&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201610%2F08%2F20161008151749_2VAKU.jpeg" alt=""></li>
  <li><img src="http://placehold.it/450x300/caaa8e/ccc.png" data-src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1549272664908&di=4bb90ffd078e31348159c07e78947f0a&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201610%2F08%2F20161008151749_2VAKU.jpeg" alt=""></li>
  <li><img src="http://placehold.it/450x300/caaa8e/ccc.png" data-src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1549272664908&di=4bb90ffd078e31348159c07e78947f0a&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201610%2F08%2F20161008151749_2VAKU.jpeg" alt=""></li>
  <li><img src="http://placehold.it/450x300/caaa8e/ccc.png" data-src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1549272664908&di=4bb90ffd078e31348159c07e78947f0a&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201610%2F08%2F20161008151749_2VAKU.jpeg" alt=""></li>
  <li><img src="http://placehold.it/450x300/caaa8e/ccc.png" data-src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1549272664908&di=4bb90ffd078e31348159c07e78947f0a&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201610%2F08%2F20161008151749_2VAKU.jpeg" alt=""></li>
  <li><img src="http://placehold.it/450x300/caaa8e/ccc.png" data-src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1549272664908&di=4bb90ffd078e31348159c07e78947f0a&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201610%2F08%2F20161008151749_2VAKU.jpeg" alt=""></li>
  <li><img src="http://placehold.it/450x300/caaa8e/ccc.png" data-src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1549272664908&di=4bb90ffd078e31348159c07e78947f0a&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201610%2F08%2F20161008151749_2VAKU.jpeg" alt=""></li>
  <li><img src="http://placehold.it/450x300/caaa8e/ccc.png" data-src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1549272664908&di=4bb90ffd078e31348159c07e78947f0a&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201610%2F08%2F20161008151749_2VAKU.jpeg" alt=""></li>
  <li><img src="http://placehold.it/450x300/caaa8e/ccc.png" data-src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1549272664908&di=4bb90ffd078e31348159c07e78947f0a&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201610%2F08%2F20161008151749_2VAKU.jpeg" alt=""></li>
  <li><img src="http://placehold.it/450x300/caaa8e/ccc.png" data-src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1549272664908&di=4bb90ffd078e31348159c07e78947f0a&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201610%2F08%2F20161008151749_2VAKU.jpeg" alt=""></li>
  <li><img src="http://placehold.it/450x300/caaa8e/ccc.png" data-src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1549272664908&di=4bb90ffd078e31348159c07e78947f0a&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201610%2F08%2F20161008151749_2VAKU.jpeg" alt=""></li>
  <li><img src="http://placehold.it/450x300/caaa8e/ccc.png" data-src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1549272664908&di=4bb90ffd078e31348159c07e78947f0a&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201610%2F08%2F20161008151749_2VAKU.jpeg" alt=""></li>
  <li><img src="http://placehold.it/450x300/caaa8e/ccc.png" data-src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1549272664908&di=4bb90ffd078e31348159c07e78947f0a&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201610%2F08%2F20161008151749_2VAKU.jpeg" alt=""></li>
  <li><img src="http://placehold.it/450x300/caaa8e/ccc.png" data-src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1549272664908&di=4bb90ffd078e31348159c07e78947f0a&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201610%2F08%2F20161008151749_2VAKU.jpeg" alt=""></li>
  <li><img src="http://placehold.it/450x300/caaa8e/ccc.png" data-src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1549272664908&di=4bb90ffd078e31348159c07e78947f0a&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201610%2F08%2F20161008151749_2VAKU.jpeg" alt=""></li>
</ul>
```

JS代码：

```javascript
const imgs = document.querySelectorAll('img')
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry && entry.isIntersecting) {
      entry.target.src = entry.target.dataset.src
      io.unobserve(entry.target)
    }
  })
})
imgs.forEach(item => {
  io.observe(item)
})
```

# 简单实现intersectionObserve
## 定义entry对象
通过对这个api的简单了解我们知道，每次我们监听的元素发生可见性的变化，回调函数都会传回一个数组，这个数组的每个成员都是一个entry对象，这个对象有两个属性值：

- target：当前对象监听的element元素
- isIntersecting：当前监听的对象是不是处于交叉状态

我们先定义好这个entry对象：

```javascript
class CustomEntry {
	public targe: Element;
	public isIntersecting: boolean;
	public constructor(options) {
		this.target = options.target;
		this.isIntersecting = options.isIntersecting
	}
}
```
## 定制intersectionObserve
接下来就要开始定制intersectionObserve，我们取名CustomObserve

### 先确定一些interface:

```javascript
interface CustomObserverOptions {
    rootMargin?: String,
    root?: Element
}
interface marginValueFormat {
    value: number,
    unit: String
}
interface Rect {
    width: number,
    height: number,
    top: number,
    left: number,
    right: number,
    bottom: number
}
```

### 成员变量

- 当前监听的所有element元素
- 当前监听的所有element-entry的映射集
- 递归调用的间隔
- 是否开始监听
- 可见性发生变化的回调函数：构造函数传参
- 监听元素的root元素（root含义参考上面）：构造函数传参，默认为整个页面，即浏览器的视窗
- 扩展root元素的一些margin值：构造函数传参


```javascript
class CustomObserver {
	private _targets: Set<Element>;
    private _entries: Map<Element, CustomEntry>;
    private _interval: number;
    private _isObserving: boolean;
    private _callback: (entries: Array<CustomEntry>) => void;
    private root: Element | null;
    private _rootMarginValues: Array<marginValueFormat>
}
```

### 构造函数
接下来是它的构造函数方法，初始化时传入两个参数：一个回调函数，当可见性发生变化时调用。一个相关配置项，用于传入root元素以及它的margin：

```javascript
public constructor(callback:() => void, options: CustomObserverOptions = {}) {
	this._targets = new Set();//监听的元素集
    this._entries = new Map();//监听的元素-entry映射集
    this._interval = 150;
    this._isObserving = false;
    this._callback = callback;
    this.root = options.root || null;
    this._rootMarginValues = parseMargin(options.rootMargin);//将传入的类似'15px 20px'的字符串格式化成下面这样方便后续计算'
}
```

### 启停监听于清除监听
接下来就是设置**开始监听**和**结束监听**的方法，还有**清除所有监听**的方法，以及设置监听完成之后的**启动监听**方法，涉及到四个函数：

```javascript
public observe(target: Element): void {
	this._targets.add(target);
	this._startObservation();
}
public unobserve(target: Element): void {
	this._targets.delete(target);
	this._entries.delete(target);
}
public disconnect(): void {
	this._targets.clear();
	this._entries.clear();
}
public _startObservation(): any {
    if (this._isObserving) {
        return;
    }
    this._isObserving = true;
    this._checkIntersection();
}
```

### 设计交叉检查
然后就是最关键的检查交叉环节了，由于我们需要密集执行函数达到监听的目的，我们使用requestAnimationFrame来调用我们的函数：

```javascript
const nextFrame = window.requestAnimationFrame
```
然后就可以设计检查交叉函数：

#### 扩展root元素
在之前我们了解到，**不管是窗口滚动或者容器内滚动，只要目标元素可见性变化，都会触发观察器**，因此对于root元素我们还需要进行一次设置，用户可以通过option的rootMarginValue设置root元素的margin来调整root块的大小

```javascript
public _checkIntersection() {
	nextFrame(() => {
		const changedEntries: CustomEntry[] = [];//设置一个数组用于存放可见性发生变化的元素，之后这个数组将直接返回
        const rootRect = expandRectByRootMargin(CustomObserver._getClientRect(this.root || document), this._rootMarginValues);
	    //...
	})
}
```

##### 格式化用户option中传入的rootMargin
_rootMarginValues值由用户传入的参数经过parseMargin函数格式化后得来：

```javascript
function parseMargin(margin: String | undefined): Array<marginValueFormat> {
    const marginString = margin || '0px';
    const margins = marginString.split(/\s+/).map(function (margin) {
        const parts = /^(-?\d*\.?\d+)(px|%)$/.exec(margin);
        if (!parts) {
            throw new Error('rootMargin must be specified in pixels or percent');
        }
        return { value: parseFloat(parts[1]), unit: parts[2] };
    });
    // Handles shorthand.
    margins[1] = margins[1] || margins[0];
    margins[2] = margins[2] || margins[0];
    margins[3] = margins[3] || margins[1];
    return margins;
}
//'15px 20px'格式化后：
/*
	[
		{ value: 15, unit: 'px' },
		{ value: 20, unit: 'px' },
		{ value: 15, unit: 'px' },
		{ value: 20, unit: 'px' }
	]
*/
```

##### 获取root元素相对视窗的位置
_getClientRect用于获取root元素相对于视窗的位置，返回Rect类型（相关API：getBoundingClientRect）：

- 如果root是document，那么直接可以得出相关值
- 如果是其他元素，调用getBoundingClientRect进行计算
- 如果该API调用出错，则返回一个大小为0的root元素

```javascript
static _getClientRect(el: any): Rect {
    if (el === document) {
        const html = document.documentElement;
        const body = document.body;
        return {
            top: 0,
            left: 0,
            right: html.clientWidth || body.clientWidth,
            width: html.clientWidth || body.clientWidth,
            bottom: html.clientHeight || body.clientHeight,
            height: html.clientHeight || body.clientHeight,
        };
    }
    try {
        return el.getBoundingClientRect();
    } catch (e) {
        return getEmptyRect();
    }
}
function getEmptyRect():Rect {
    return {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        width: 0,
        height: 0,
    };
}
```
##### 计算得出最终的root元素大小
expandRectByRootMargin用于计算得出，加上用户的rootMarginValue扩展之后的root元素大小：

```javascript
function expandRectByRootMargin(rect: Rect, rootMarginValues: Array<marginValueFormat>): Rect {
    const margins = rootMarginValues.map(function (margin, i) {
        return margin.unit === 'px' ? margin.value
            : margin.value * (i % 2 ? rect.width : rect.height) / 100;
    });
    const newRect: Rect = {
        top: rect.top - margins[0],
        right: rect.right + margins[1],
        bottom: rect.bottom + margins[2],
        left: rect.left - margins[3],
        width:0,
        height:0
    };
    newRect.width = newRect.right - newRect.left;
    newRect.height = newRect.bottom - newRect.top;
    return newRect;
}
```
#### 可见性判断
调整完root元素之后我们就可以遍历所有监听元素，对他们的可见性进行判断：

```javascript
public _checkIntersection() {
	nextFrame(() => {
	    //...
	    for (const el of this._targets) {
             const isDisplay = checkIsDisplay(el);
             const rect = el.getBoundingClientRect();
             // 降级到CustomObserver仅仅校验位置是否交叉，交叉就当做元素已经展示了
             const intersectionRect = computeRectIntersection(rect, rootRect);
             const newEntry = new CustomEntry({
                 target: el,
                 isIntersecting: isDisplay && !!intersectionRect,
             });
             const oldEntry = this._entries.get(el);
             if (!oldEntry || oldEntry.isIntersecting !== newEntry.isIntersecting) {
                 changedEntries.push(newEntry);
             }
             this._entries.set(el, newEntry);
         }
         //...
	})
}
```
上述代码包含这些步骤：
1. 先检查这个元素的display值是不是none：
```javascript
function checkIsDisplay(el: Element): boolean {
    let ele: Element | null = el
    while (ele) {
        if (el.nodeType === 1) {
            if (getComputedStyle(el).display === 'none') {
                return false;
            }
            ele = ele.parentElement;
        }
    }
    return true;
}
```
2. 获取当前元素相对于视窗的位置
3. 根据当前元素相对于视窗的位置和root元素相对于视窗的位置，计算当前元素和root元素是否有交叉
4. 更新元素-entry映射集，并将可见性发生了变化的元素加入到changedEntries中

##### 计算是否有交叉
在交叉检查这一步当中，最核心的当属计算是否有交叉检查，根据当前元素相对于视窗的位置和root元素相对于视窗的位置计算得到,没有交叉则返回false，否则返回交叉部分的信息：

```javascript
function computeRectIntersection(rect1: Rect, rect2: Rect): boolean | Rect {
    const top = Math.max(rect1.top, rect2.top);
    const bottom = Math.min(rect1.bottom, rect2.bottom);
    const left = Math.max(rect1.left, rect2.left);
    const right = Math.min(rect1.right, rect2.right);
    const width = right - left;
    const height = bottom - top;
    return width >= 0 && height >= 0 && {
        top: top,
        bottom: bottom,
        left: left,
        right: right,
        width: width,
        height: height,
    };
}
```

#### 调用回调函数
当可见性发生变化的元素的数量大于0时，就可以调用回调函数

```javascript
public _checkIntersection() {
	nextFrame(() => {
	    //...
	    if (changedEntries.length) {
           this._callback(changedEntries);
        }
	})
}
```

#### 递归调用交叉检查函数
只要监听的元素数量大于0，就永远都要不断执行检查函数，这个时候就可以进行递归调用

```javascript
public _checkIntersection() {
	nextFrame(() => {
	    //...
	    if (this._targets.size > 0) {
                setTimeout(() => this._checkIntersection(), this._interval);
            } else {
                this._isObserving = false;
            }
	})
}
```

## 完成
至此，一个简单的intersectionObserve就完成了：

```javascript
const nextFrame = window.requestAnimationFrame || setTimeout;

export class CustomEntry {
    public isIntersecting: boolean;
    public target: Element;
    public constructor(options) {
        this.isIntersecting = options.isIntersecting;
        this.target = options.target;
    }
}

interface CustomObserverOptions {
    rootMargin?: String,
    root?: Element
}
interface marginValueFormat {
    value: number,
    unit: String
}
interface Rect {
    width: number,
    height: number,
    top: number,
    left: number,
    right: number,
    bottom: number
}
export class CustomObserver {
    private _targets: Set<Element>;
    private _entries: Map<Element, CustomEntry>;
    private _interval: number;
    private _isObserving: boolean;
    private _callback: (entries: Array<CustomEntry>) => void;
    private root: Element | null;
    private _rootMarginValues: Array<marginValueFormat>
    public constructor(callback, options: CustomObserverOptions = {}) {
        this._targets = new Set();
        this._entries = new Map();
        this._interval = 150;
        this._isObserving = false;
        this._callback = callback;
        this.root = options.root || null;
        this._rootMarginValues = parseMargin(options.rootMargin);
    }
    public observe(target: Element): void {
        this._targets.add(target);
        this._startObservation();
    }
    public unobserve(target: Element): void {
        this._targets.delete(target);
        this._entries.delete(target);
    }
    public disconnect(): void {
        this._targets.clear();
        this._entries.clear();
    }
    public _startObservation(): any {
        if (this._isObserving) {
            return;
        }
        this._isObserving = true;
        this._checkIntersection();
    }
    public _checkIntersection() {
        nextFrame(() => {
            const changedEntries: CustomEntry[] = [];
            const rootRect = expandRectByRootMargin(CustomObserver._getClientRect(this.root || document), this._rootMarginValues);
            for (const el of this._targets) {
                const isDisplay = checkIsDisplay(el);
                const rect = el.getBoundingClientRect();
                const intersectionRect = computeRectIntersection(rect, rootRect);
                const newEntry = new CustomEntry({
                    target: el,
                    isIntersecting: isDisplay && !!intersectionRect,
                });
                const oldEntry = this._entries.get(el);
                if (!oldEntry || oldEntry.isIntersecting !== newEntry.isIntersecting) {
                    changedEntries.push(newEntry);
                }
                this._entries.set(el, newEntry);
            }
            if (changedEntries.length) {
                this._callback(changedEntries);
            }
            if (this._targets.size > 0) {
                setTimeout(() => this._checkIntersection(), this._interval);
            } else {
                this._isObserving = false;
            }
        });
    }
    static _getClientRect(el: any): Rect {
        if (el === document) {
            const html: Element = document.documentElement;
            const body: Element = document.body;
            return {
                top: 0,
                left: 0,
                right: html.clientWidth || body.clientWidth,
                width: html.clientWidth || body.clientWidth,
                bottom: html.clientHeight || body.clientHeight,
                height: html.clientHeight || body.clientHeight,
            };
        }
        try {
            return el.getBoundingClientRect();
        } catch (e) {
            return getEmptyRect();
        }
    }
}
function computeRectIntersection(rect1: Rect, rect2: Rect): boolean | Rect {
    const top = Math.max(rect1.top, rect2.top);
    const bottom = Math.min(rect1.bottom, rect2.bottom);
    const left = Math.max(rect1.left, rect2.left);
    const right = Math.min(rect1.right, rect2.right);
    const width = right - left;
    const height = bottom - top;
    return width >= 0 && height >= 0 && {
        top: top,
        bottom: bottom,
        left: left,
        right: right,
        width: width,
        height: height,
    };
}
function parseMargin(margin: String | undefined): Array<marginValueFormat> {
    const marginString = margin || '0px';
    const margins = marginString.split(/\s+/).map(function (margin) {
        const parts = /^(-?\d*\.?\d+)(px|%)$/.exec(margin);
        if (!parts) {
            throw new Error('rootMargin must be specified in pixels or percent');
        }
        return { value: parseFloat(parts[1]), unit: parts[2] };
    });
    // Handles shorthand.
    margins[1] = margins[1] || margins[0];
    margins[2] = margins[2] || margins[0];
    margins[3] = margins[3] || margins[1];
    return margins;
}
function expandRectByRootMargin(rect: Rect, rootMarginValues: Array<marginValueFormat>): Rect {
    const margins = rootMarginValues.map(function (margin, i) {
        return margin.unit === 'px' ? margin.value
            : margin.value * (i % 2 ? rect.width : rect.height) / 100;
    });
    const newRect: Rect = {
        top: rect.top - margins[0],
        right: rect.right + margins[1],
        bottom: rect.bottom + margins[2],
        left: rect.left - margins[3],
        width:0,
        height:0
    };
    newRect.width = newRect.right - newRect.left;
    newRect.height = newRect.bottom - newRect.top;
    return newRect;
}

function checkIsDisplay(el: Element): boolean {
    let ele: Element | null = el
    while (ele) {
        if (el.nodeType === 1) {
            if (getComputedStyle(el).display === 'none') {
                return false;
            }
            ele = ele.parentElement;
        }
    }
    return true;
}

function getEmptyRect():Rect {
    return {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        width: 0,
        height: 0,
    };
}
export default CustomObserver;
```
