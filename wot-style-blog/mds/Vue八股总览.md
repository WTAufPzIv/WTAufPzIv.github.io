# Vue简述

Vue是⼀套⽤于构建⽤户界⾯的渐进式框架，Vue的核⼼只关注视图层

## 声名式框架

声明式代码更加简单，不需要关注实现，按照要求填写代码就可以

> 扩展：什么是声名式，什么是命令式
> 早年间流行的jQuery就是典型的命令式框架。命令式框架的一大特点就是关注过程。
> 例子：把下面这段话翻译成对应的代码
>
> 获取id为app的div标签
> 它的文本内容为hello world
> 为其绑定点击事件
> 当点击时弹出提示：ok
>
> $('#app') // 获取div
> .text('hello world') // 设置文本内容
> .on('click', () => { alert('ok') }) // 绑定点击事件
>
> 可以看到，自然语言描述能够与代码产生一一对应的关系，代码本身描述的是“做事的过程”，这符合我们的逻辑直觉
> 那么，什么是声明式框架呢？与命令式框架更加关注过程不同，声明式框架更加关注结果。结合Vue.js，实现上面自然语言描述的功能
>
> /*<div @click="()  => alert('ok')">hello world</div>*/

## MVVM模式

VUE是mvvm的最佳实践者，其对于mvvm开发模式的体现主要在以下这些方面

- model
  - Vue 的模型层通常由 Vue 实例的 data 对象管理。data 对象包含了应用程序的状态和数据
- view
  - Vue 的视图层由模板（template）定义。模板是 Vue 组件的一个重要部分，通过模板可以声明式地定义用户界面
- ViewModal
  - Vue 实例本身充当 ViewModel 的角色。它包含 data（模型数据）以及用于操作这些数据的方法。Vue 通过响应式系统（reactive system）自动管理数据和视图之间的同步。视图中的绑定会自动更新，以反映模型数据的变化

> 扩展：React既不是mvc，也不是mvvm，它更接近于v，它由单个组件内部维护自己的状态和渲染逻辑，组件状态由组件自身管理，状态发生变更后视图的更新操作也由组件内部手动触发，因此react没有实现数据的双向绑定自动更新。

但是Vue也并不是完全遵循mvvm的模式

- 数据绑定
  - mvvm：视图（View）和视图模型（ViewModel）之间通过双向数据绑定实现自动同步。这意味着视图中的变化会自动反映在视图模型中，反之亦然
  - Vue 通过其响应式系统实现了双向数据绑定，但在实际开发中，Vue 鼓励开发者主要使用单向数据流，即数据从父组件流向子组件，事件从子组件传递回父组件。双向绑定（如 v-model）主要用于表单元素的输入和输出，帮助简化表单处理
- 组件化
  - mvvm：传统的 MVVM 模式关注视图和视图模型之间的关系，而没有特别强调组件化
  - vue：Vue 强调组件化开发，将应用分解为可复用的组件。每个组件可以包含自己的模板、逻辑和样式。组件化思想在某种程度上超越了传统的 MVVM 模式
- model层
  - mvvm：MVVM 中的模型（Model）是独立于视图和视图模型的，负责管理应用的数据和业务逻辑
  - vur：数据通常定义在组件的 data 选项中，并由 Vue 的响应式系统管理。这使得 Vue 的数据模型更接近视图模型的一部分，而不是完全独立的模型层
- 控制器逻辑
  - mvvm：MVVM 模式没有明确的控制器（Controller）概念，视图模型承担了大部分的控制逻辑
  - vue：Vue 组件中的方法（methods）通常承担了部分控制器的职责，处理用户交互和逻辑。因此，Vue 的组件既包含了视图模型的角色，也承担了一些控制器的职责
- 状态管理
  - mvvm：模式本身不包含全局状态管理的解决方案
  - vue：对于大型应用，Vue 提供了 Vuex 作为状态管理库，用于管理全局状态。这种全局状态管理机制在传统的 MVVM 模式中没有明确的对应物

尽管 Vue 采用了许多 MVVM 的概念（如数据绑定、视图模型的概念），但它并不严格遵循 MVVM 模式。Vue 更像是从 MVVM 模式中借鉴了有用的部分，并结合了组件化开发的思想，以提供更高效、更灵活的开发体验。这使得 Vue 在设计和实现上具备了更多的灵活性，能够适应不同规模和复杂度的应用开发需求

# 单页面应用

## 概念
SPA(single-page application)单页面应用，默认情况下编写Vue、React都只有一个html页面，并且提供一个挂载点，最终页面打包后会在此页面引入对应的资源。（页面的渲染全部是有JS动态进行渲染的）切换页面时通过监听路由变化，渲染对应的页面。也就是：Client Side Rendering，客户端渲染CSR

多页面应用：多个html页面。每个页面必须重复加载js，css等资源。（服务端返回完整的html，同时数据也可以在后端进行获取一并返回“模板引擎”），多页面应用跳转需要整页资源刷新。Server Side Rendering，服务端渲染 SSR

|         | 单页面应用   |  多页面应用  |
| :--------  | :-----  | :----:  |
| 组成 | 一个主页面空壳和页面组件 | 多个完整的页面 |
| 刷新方式 | 局部刷新 | 整页刷新 |
| SEO | 无能为力 | 容易实现 |
| 页面切换 | 速度快，体验好 | 需要重载全部资源，速度慢，体验差 |
| 维护成本 | 相对容易 | 成本相对较高 |

## 白屏时间解决方案：

1. 减少打包文件大小
  a. 代码拆分：使用 Webpack 或其他打包工具进行代码拆分，按需加载不同的模块
  b. 懒加载（Lazy Loading）：对于不需要立即加载的模块，使用懒加载技术
  c. 压缩和混淆代码：使用工具如 UglifyJS、Terser 对代码进行压缩和混淆
2. 优化静态资源
  a. 使用CDN：将静态资源（如 JavaScript、CSS、图片等）部署到内容分发网络（CDN）上，提高资源加载速度
  b. 缓存策略：设置合适的缓存策略，利用浏览器缓存减少资源加载时间
3. 减少HTTP请求
  a. 合并文件：尽量合并 CSS 和 JavaScript 文件，减少 HTTP 请求数量。
  b. 内联关键CSS：将关键 CSS 直接内联到 HTML 中，减少 CSS 文件加载数量
4. 服务器端渲染（SSR）
  a. 使用框架支持SSR：例如 Next.js（适用于 React）或 Nuxt.js（适用于 Vue.js）等框架，能够在服务器端渲染页面，减少白屏时间。
5. 服务端推送（HTTP/2）
  a. 启用HTTP/2：利用 HTTP/2 的服务端推送特性，在客户端请求页面时，提前推送 CSS、JS 等资源，提高页面加载速度
6. 预渲染（Prerendering）：
  a. 静态生成：对于一些页面较少的应用，可以使用预渲染技术，在构建时生成静态 HTML 文件。
7. 骨架屏（Skeleton Screen）
  a. 加载占位符:在加载实际内容前，显示骨架屏占位符，减少用户感知到的白屏时间
8. 优化JavaScript执行
  a. 异步加载：使用 async 或 defer 属性加载 JavaScript 文件，避免阻塞页面渲染
  b. 减少阻塞代码：优化和减少页面初始加载时需要执行的 JavaScript 代码
9. 优化首屏渲染
  a. 减少首屏数据：首屏只加载必要的数据，延迟加载其他数据
  b. 渲染顺序优化：确保关键内容优先渲染，减少用户感知的白屏时间
10. 使用性能监测工具
  a. 使用 Lighthouse、WebPageTest 等工具进行性能监测和分析，找出性能瓶颈并进行针对性优化。通过这些优化措施，可以有效减少单页面应用的白屏时间，提升用户体验。
S

**预渲染和服务端渲染的区别:**

|         | SSR   |  Pre Render  |
| :--------  | :-----  | :----:  |
| 数据获取时机 | 用户请求时 | 构建时 |
| 数据是否最新 | 每次请求获取最新数据 | 数据可能滞后（需要重新构建以更新数据） |
| 实现复杂度 | 较高（需要服务器环境，实时获取数据） | 较低（构建时一次性获取数据） |
| 性能 | 初次加载快，服务器负载高 | 加载极快，服务器负载低 |
| 适用场景 | 动态内容，数据频繁更新的网站 | 静态内容，数据变化不频繁的网站 |
| SEO | 优秀 | 优秀 |

# 虚拟DOM

基本上所有框架都引入了虚拟DOM来对真实DOM进行抽象，也就是现在大家所熟知的VNode和VDom

> Virtual DOM就是用js对象来描述真实DOM，是对真实DOM的抽象，由于直接操作DOM性能低，但是js层的操作效率高，可以将DOM操作转化成对象操作，最终通过diff算法对比差异进行更新DOM，来减少对真实DOM的操作。虚拟DOM不依赖真实平台环境从而也可以实现跨平台

## 虚拟DOM从生成到渲染的原理

1. 模板编译：在 Vue 中，模板可以是字符串、单文件组件（.vue 文件）中的 ```<template>``` 部分，或直接写在 JavaScript 中的模板字符串。在构建过程或运行时，Vue 会将模板编译成渲染函数。
   1. 编译过程包括解析（parsing）、优化（optimizing）和生成（code generation）三个阶段。
      1. 解析：将模板字符串解析成抽象语法树（AST）。
	    2. 优化：**标记静态节点**，提高后续更新的性能。
      3. 生成：将优化后的 AST 转换成渲染函数的字符串表示。
```js
// 模板字符串
const template = `<div id="app">{{ message }}</div>`;

// 解析模板生成 AST
const ast = parse(template);

// 优化 AST
optimize(ast);

// 生成渲染函数
const code = generate(ast);

// 渲染函数示例
const render = new Function(`with(this){return ${code}}`);
```
2. 渲染函数：编译后的渲染函数是一个返回虚拟 DOM 描述的 JavaScript 函数。这个函数在组件实例的上下文中执行，返回一个虚拟节点树（VNode Tree）。
```js
function render() {
  return this._c('div', { attrs: { id: 'app' } }, [this._v(this._s(this.message))]);
}
// 在上面的代码中，_c 是创建元素的方法，_v 是创建文本节点的方法，_s 是将数据转化为字符串的方法。
```
3. 创建虚拟节点（VNode）：虚拟节点是一个普通的 JavaScript 对象，包含描述真实 DOM 所需的所有信息。
```js
const vnode = {
  tag: 'div',
  data: { attrs: { id: 'app' } },
  children: [{ text: 'Hello Vue!' }],
  elm: undefined,
  context: vm,
  key: undefined
};
```
4. 渲染虚拟DOM：当组件实例调用渲染函数时，Vue 会生成虚拟节点树（VNode Tree）。
5. 虚拟 DOM 到实际 DOM：生成虚拟 DOM 后，Vue 会通过 createElm 函数将虚拟 DOM 转换为实际 DOM，并将其插入到页面中
   1. createElm 函数会递归遍历虚拟节点树，并根据节点的信息创建相应的真实 DOM 元素。
```js
function createElm(vnode) {
  const el = document.createElement(vnode.tag);

  // 设置属性
  for (const key in vnode.data.attrs) {
    el.setAttribute(key, vnode.data.attrs[key]);
  }

  // 创建子节点
  vnode.children.forEach(child => {
    el.appendChild(createElm(child));
  });

  vnode.elm = el;
  return el;
}
```
   2. 创建完真实 DOM 元素后，将其插入到页面中
```js
const vnode = render.call(vm);
const el = createElm(vnode);
document.body.appendChild(el);
```

## vue的diff算法

Vue 的 diff 算法主要用于比较新旧虚拟 DOM 树，找出最小的变化集，从而高效地更新实际 DOM。Vue 的 diff 算法基于 React 的算法，但做了一些优化。以下是 Vue 的 diff 算法的详细步骤和机制：

**核心思想:**

1.	逐层比较：只比较同一层级的节点，不进行跨层级比较。
2.	双端比较：同时从头部和尾部进行比较，尽量减少遍历次数。
3.	Key 值优化：通过 Key 值标识节点，优化节点复用和重新排列。

**步骤详解:**

1. 初始条件
	•	oldVNode：旧的虚拟 DOM 树（上一次渲染生成的）。
	•	newVNode：新的虚拟 DOM 树（本次渲染生成的）。
2. patch函数：patch 函数是核心入口，它递归地比较新旧虚拟 DOM 树并更新实际 DOM。
```js
function patch(oldVNode, newVNode) {
  if (!oldVNode) {
    // oldVNode 不存在，直接创建新节点并插入
    return createElm(newVNode);
  } else if (!newVNode) {
    // newVNode 不存在，直接移除旧节点
    return removeNode(oldVNode);
  } else if (sameVNode(oldVNode, newVNode)) {
    // 如果新旧节点是同一个节点，进行详细比较和更新
    patchVNode(oldVNode, newVNode);
  } else {
    // 新旧节点不同，直接替换旧节点
    const parent = oldVNode.elm.parentNode;
    const newEl = createElm(newVNode);
    parent.insertBefore(newEl, oldVNode.elm);
    parent.removeChild(oldVNode.elm);
  }
}
```
3. sameVNode函数：sameVNode 函数用于判断两个节点是否是同一个节点。通常通过节点的 key 和 tag 进行判断。
```js
function sameVNode(a, b) {
  return a.key === b.key && a.tag === b.tag;
}
```
4. patchVNode 函数：patchVNode 函数用于详细比较和更新同一个节点。
```js
function patchVNode(oldVNode, newVNode) {
  const el = newVNode.elm = oldVNode.elm;

  // 更新文本节点
  if (oldVNode.text !== newVNode.text) {
    el.textContent = newVNode.text;
  }

  // 比较子节点
  if (oldVNode.children && newVNode.children) {
    updateChildren(el, oldVNode.children, newVNode.children);
  } else if (newVNode.children) {
    // 新节点有子节点，旧节点没有
    for (let i = 0; i < newVNode.children.length; i++) {
      el.appendChild(createElm(newVNode.children[i]));
    }
  } else if (oldVNode.children) {
    // 旧节点有子节点，新节点没有
    el.innerHTML = '';
  }

  // 更新属性
  updateProps(el, oldVNode.data, newVNode.data);
}
```
5. updateChildren 函数：updateChildren 函数是 diff 算法的核心部分，它采用双端比较策略，尽可能高效地对比和更新子节点。
```js
function updateChildren(parentElm, oldCh, newCh) {
  let oldStartIdx = 0;
  let oldEndIdx = oldCh.length - 1;
  let newStartIdx = 0;
  let newEndIdx = newCh.length - 1;
  let oldStartVNode = oldCh[oldStartIdx];
  let oldEndVNode = oldCh[oldEndIdx];
  let newStartVNode = newCh[newStartIdx];
  let newEndVNode = newCh[newEndIdx];

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (!oldStartVNode) {
      oldStartVNode = oldCh[++oldStartIdx];
    } else if (!oldEndVNode) {
      oldEndVNode = oldCh[--oldEndIdx];
    } else if (sameVNode(oldStartVNode, newStartVNode)) {
      patchVNode(oldStartVNode, newStartVNode);
      oldStartVNode = oldCh[++oldStartIdx];
      newStartVNode = newCh[++newStartIdx];
    } else if (sameVNode(oldEndVNode, newEndVNode)) {
      patchVNode(oldEndVNode, newEndVNode);
      oldEndVNode = oldCh[--oldEndIdx];
      newEndVNode = newCh[--newEndIdx];
    } else if (sameVNode(oldStartVNode, newEndVNode)) {
      patchVNode(oldStartVNode, newEndVNode);
      parentElm.insertBefore(oldStartVNode.elm, oldEndVNode.elm.nextSibling);
      oldStartVNode = oldCh[++oldStartIdx];
      newEndVNode = newCh[--newEndIdx];
    } else if (sameVNode(oldEndVNode, newStartVNode)) {
      patchVNode(oldEndVNode, newStartVNode);
      parentElm.insertBefore(oldEndVNode.elm, oldStartVNode.elm);
      oldEndVNode = oldCh[--oldEndIdx];
      newStartVNode = newCh[++newStartIdx];
    } else {
      const idxInOld = findIdxInOld(newStartVNode, oldCh, oldStartIdx, oldEndIdx);
      if (idxInOld == -1) {
        parentElm.insertBefore(createElm(newStartVNode), oldStartVNode.elm);
        newStartVNode = newCh[++newStartIdx];
      } else {
        const vnodeToMove = oldCh[idxInOld];
        patchVNode(vnodeToMove, newStartVNode);
        oldCh[idxInOld] = undefined;
        parentElm.insertBefore(vnodeToMove.elm, oldStartVNode.elm);
        newStartVNode = newCh[++newStartIdx];
      }
    }
  }

  if (oldStartIdx > oldEndIdx) {
    const before = newCh[newEndIdx + 1] ? newCh[newEndIdx + 1].elm : null;
    addVNodes(parentElm, before, newCh, newStartIdx, newEndIdx);
  } else if (newStartIdx > newEndIdx) {
    removeVNodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
  }
}
```
6. 辅助函数
	•	findIdxInOld：在旧节点列表中找到与新节点匹配的节点索引。
	•	addVNodes：将新的虚拟节点转换为真实 DOM 并插入到父节点中。
	•	removeVNodes：从父节点中移除不再需要的旧节点。
	•	createElm：创建虚拟节点对应的真实 DOM 元素。
	•	updateProps：更新节点的属性。

## key
- Vue在patch的过程中，通过key可以判断两个虚拟节点是否是相同节点（可以复用老节点）
- 无key会导致更新的时候出问题（逆序添加，逆序删除等破坏顺序操作）
- 尽量不要采用索引作为key

# 响应式

## 什么是vue的响应式
**vue数据响应式的初衷是为了实现数据和函数的联动**，当业务数据发生变化后自动重新执行与之关联的函数

具体到vue中，数据和组件的render函数关联在一起，当数据发生变化后自动重新执行render，生成新的Vnode，然后通过diff和重新渲染，感官上就是页面发生了变化

除了vue自动关联的render函数，还有诸如watchEffect、watch、computed等等，都是利用了这个思想

## 如何实现响应式数据
数组和对象类型当值变化时如何劫持到。使用Object.defineProperty将属性进行劫持（只会劫持已经存在的属性），数组则是通过重写数组方法来实现。多层对象是通过递归来实现劫持，Vue3则采用proxy

## Vue2处理缺陷
- 在Vue2的时候使用defineProperty来进行数据的劫持，需要对属性进行重写添加getter和setter，性能较差当新增属性和删除属性时无法监控变化，需要通过```$set，$delete```实现
- 数组不采用defineProperty来进行劫持（浪费性能，对所有索引进行劫持会造成性能浪费）需要对数组单独进行处理
- 对于ES6中新产生的Map和Set不支持

## Vue3实现响应式数据
通过proxy，没有重写属性，只是做了一层代理，而且拦截的是对象，而不是对象内的属性，因此可以监测新增属性和删除属性时的变化，且可以监测数组变化
 
而且当对象是多层时，不会一上来就进行递归。当不去取对象中数组时，数组是不会被代理的，是一种懒代理

## Vue如何监测数组变化
- 数组考虑性能原因没有用defineProperty对数组的每一项进行拦截，而是选择重写数组方法(push、pop、shift、unshift、splice、sort、reverse)
- 数组中如果是对象属性类型也会进行递归劫持

不足：数组的索引和长度变化是无法监控到的

## 响应式的详细流程

### 数据劫持和对象代理

如果我们用 JavaScript 写这样的逻辑：
```js
let A0 = 1
let A1 = 2
let A2 = A0 + A1

console.log(A2) // 3

A0 = 2
console.log(A2) // 仍然是 3
```
当我们更改 A0 后，A2 不会自动更新。

那么我们如何在 JavaScript 中做到这一点呢？首先，为了能重新运行计算的代码来更新 A2，我们需要将其包装为一个函数：

```js
let A2

function update() {
  A2 = A0 + A1
}
```

然后，我们需要定义几个术语：

- 这个 ```update()``` 函数会产生一个副作用，或者就简称为作用 **(effect)**，因为它会更改程序里的状态。
- A0 和 A1 被视为这个作用的依赖 **(dependency)**，因为它们的值被用来执行这个作用。
- 这次作用也可以被称作它的依赖的一个订阅者 **(subscriber)**。

我们需要一个魔法函数，能够在 A0 或 A1 (这两个依赖) 变化时调用 update() (产生作用)。

```js
whenDepsChange(update)
```

这个 whenDepsChange() 函数有如下的任务：

1. 当一个变量被读取时进行追踪。例如我们执行了表达式 A0 + A1 的计算，则 A0 和 A1 都被读取到了。

2. 如果一个变量在当前运行的副作用中被读取了，就将该副作用设为此变量的一个订阅者。例如由于 A0 和 A1 在 update() 执行时被访问到了，则 update() 需要在第一次调用之后成为 A0 和 A1 的订阅者。

3. 探测一个变量的变化。例如当我们给 A0 赋了一个新的值后，应该通知其所有订阅了的副作用重新执行。

我们无法直接追踪对上述示例中局部变量的读写，原生 JavaScript 没有提供任何机制能做到这一点。但是，我们是可以追踪对象属性的读写的。

在 JavaScript 中有两种劫持 property 访问的方式：getter / setters 和 Proxies。Vue 2 使用 getter / setters 完全是出于支持旧版本浏览器的限制。而在 Vue 3 中则使用了 Proxy 来创建响应式对象，仅将 getter / setter 用于 ref。下面的伪代码将会说明它们是如何工作的：
```js
// Vue 2
function defineReactive(obj, key, val) {
  const dep = new Dep();
  Object.defineProperty(obj, key, {
    get() {
      dep.depend();
      return val;
    },
    set(newVal) {
      if (val !== newVal) {
        val = newVal;
        dep.notify();
      }
    }
  });
}

// Vue 3
const reactive = (target) => {
  return new Proxy(target, {
    get(target, key, receiver) {
      const result = Reflect.get(target, key, receiver);
      track(target, key);
      return result;
    },
    set(target, key, value, receiver) {
      const oldValue = target[key];
      const result = Reflect.set(target, key, value, receiver);
      if (oldValue !== value) {
        trigger(target, key);
      }
      return result;
    }
  });
};
function ref(value) {
  const refObject = {
    get value() {
      track(refObject, 'value')
      return value
    },
    set value(newValue) {
      value = newValue
      trigger(refObject, 'value')
    }
  }
  return refObject
}
```
以上代码解释了一些 reactive() 的局限性：

- 当你将一个响应式对象的属性赋值或解构到一个本地变量时，访问或赋值该变量是非响应式的，因为它将不再触发源对象上的 get / set 代理。注意这种“断开”只影响变量绑定——如果变量指向一个对象之类的非原始值，那么对该对象的修改仍然是响应式的。

- 从 reactive() 返回的代理尽管行为上表现得像原始对象，但我们通过使用 === 运算符还是能够比较出它们的不同。

在 ```track()``` 内部，我们会检查当前是否有正在运行的副作用。如果有，我们会查找到一个存储了所有追踪了该属性的订阅者的 Set，然后将当前这个副作用作为新订阅者添加到该 Set 中。
```js
// 这会在一个副作用就要运行之前被设置
// 我们会在后面处理它
let activeEffect

function track(target, key) {
  if (activeEffect) {
    const effects = getSubscribersForProperty(target, key)
    effects.add(activeEffect)
  }
}
```
副作用订阅将被存储在一个全局的 ```WeakMap<target, Map<key, Set<effect>>>``` 数据结构中。如果在第一次追踪时没有找到对相应属性订阅的副作用集合，它将会在这里新建。这就是 getSubscribersForProperty() 函数所做的事。为了简化描述，我们跳过了它其中的细节。

在 ```trigger()``` 之中，我们会再查找到该属性的所有订阅副作用。但这一次我们需要执行它们

```js
function trigger(target, key) {
  const effects = getSubscribersForProperty(target, key)
  effects.forEach((effect) => effect())
}
```
现在让我们回到 whenDepsChange() 函数
```js
function whenDepsChange(update) {
  const effect = () => {
    activeEffect = effect
    update()
    activeEffect = null
  }
  effect()
}
```

它将原本的 update 函数包装在了一个副作用函数中。在运行实际的更新之前，这个外部函数会将自己设为当前活跃的副作用。这使得在更新期间的 track() 调用都能定位到这个当前活跃的副作用。

此时，我们已经创建了一个能自动跟踪其依赖的副作用，它会在任意依赖被改动时重新运行。我们称其为响应式副作用。

Vue 提供了一个 API 来让你创建响应式副作用 watchEffect()。事实上，你会发现它的使用方式和我们上面示例中说的魔法函数 whenDepsChange() 非常相似。我们可以用真正的 Vue API 改写上面的例子：

```js
import { ref, watchEffect } from 'vue'

const A0 = ref(0)
const A1 = ref(1)
const A2 = ref()

watchEffect(() => {
  // 追踪 A0 和 A1
  A2.value = A0.value + A1.value
})

// 将触发副作用
A0.value = 2
```
使用一个响应式副作用来更改一个 ref 并不是最优解，事实上使用计算属性会更直观简洁：
```js
import { ref, computed } from 'vue'

const A0 = ref(0)
const A1 = ref(1)
const A2 = computed(() => A0.value + A1.value)

A0.value = 2
```

### 依赖收集
Vue 3 的依赖收集机制在其响应式系统中起着至关重要的作用。相比于 Vue 2，Vue 3 采用了 Proxy 来替代 Object.defineProperty，从而实现更高效、更灵活的响应式系统。以下是 Vue 3 的依赖收集的详细过程：


1. 目标和基本概念

Vue 3 的依赖收集依赖于三个核心概念：

•	Reactive Objects（响应式对象）：使用 reactive 函数将普通对象转换为响应式对象。
•	Effects（副作用函数）：在依赖变化时自动重新执行的函数。
•	Track and Trigger（追踪和触发）：用于依赖收集和依赖变更时的通知机制。

实现细节

1. 创建响应式对象：Vue 3 使用 reactive 函数将普通对象转换为响应式对象。这是通过 Proxy 实现的，Proxy 可以拦截对对象的所有操作。
```js
import { reactive } from 'vue';

const state = reactive({
  count: 0
});
```
2. 副作用函数（Effect）

effect 函数用于注册副作用函数，并在响应式数据发生变化时重新执行这些函数。effect 函数的实现涉及到副作用函数的收集、追踪和触发机制。

```js
import { effect } from 'vue';

effect(() => {
  console.log(state.count); // 当 state.count 变化时，这个函数会重新执行
});
```

3. 追踪依赖（Track）：当副作用函数访问响应式对象的属性时，Vue 3 会进行依赖追踪。它会将当前执行的副作用函数记录为该属性的依赖

```js
const bucket = new WeakMap();

function track(target, key) {
  if (!activeEffect) return;
  let depsMap = bucket.get(target);
  if (!depsMap) {
    bucket.set(target, (depsMap = new Map()));
  }
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }
  dep.add(activeEffect);
  activeEffect.deps.push(dep);
}

// •	activeEffect：只有在有活跃的副作用函数时才进行依赖收集。
// •	bucket：从 bucket 中获取 target 对应的 depsMap，如果不存在则新建。
// •	depsMap：获取 key 对应的依赖集合 dep，如果不存在则新建。
// •	dep：将当前的副作用函数 activeEffect 添加到依赖集合 dep 中，并记录该依赖集合到副作用函数的 deps 中。
```

4. 触发更新（Trigger）：当响应式对象的属性发生变化时，Vue 3 会触发依赖于该属性的副作用函数，重新执行这些函数。

```js
function trigger(target, key) {
  const depsMap = bucket.get(target);
  if (!depsMap) return;
  const effects = new Set();
  const addEffects = (effectsToAdd) => {
    effectsToAdd.forEach(effect => effects.add(effect));
  };
  addEffects(depsMap.get(key));
  effects.forEach(effect => {
    if (effect.options.scheduler) {
      effect.options.scheduler(effect);
    } else {
      effect();
    }
  });
}
	// •	depsMap：从 bucket 中获取 target 对应的 depsMap。
	// •	effects：使用 Set 集合保存需要运行的副作用函数，避免重复执行。
	// •	effectsToRun：从 depsMap 中获取 key 对应的依赖集合 effectsToRun。
	// •	scheduler：如果副作用函数有调度器（scheduler），则调用调度器，否则直接执行副作用函数。
```

5. Proxy 拦截：通过 Proxy，Vue 3 可以拦截对象的读写操作，从而实现依赖追踪和触发更新。

```js
const handler = {
  get(target, key, receiver) {
    const result = Reflect.get(target, key, receiver);
    track(target, key);
    return result;
  },
  set(target, key, value, receiver) {
    const oldValue = target[key];
    const result = Reflect.set(target, key, value, receiver);
    if (oldValue !== value) {
      trigger(target, key);
    }
    return result;
  }
};

const state = new Proxy(target, handler);
```

### 副作用函数
在 Vue 3 中，effect 函数用于注册副作用函数，并在响应式数据发生变化时重新执行这些函数。effect 函数的实现涉及到副作用函数的收集、追踪和触发机制。以下是 effect 函数的实现细节。

1.  定义全局变量：需要一些全局变量来跟踪当前正在执行的副作用函数以及存储所有的依赖关系。

```js
let activeEffect = null;
const bucket = new WeakMap();

// activeEffect：当前正在执行的副作用函数。
// bucket：用来存储所有响应式对象及其属性的依赖关系。
```

2. effect 函数的实现：effect 函数用于注册副作用函数，并在首次执行时进行依赖收集。

```js
function effect(fn, options = {}) {
  const effectFn = () => {
    cleanup(effectFn);
    activeEffect = effectFn;
    fn();
    activeEffect = null;
  };
  effectFn.deps = [];
  effectFn.options = options;
  if (!options.lazy) {
    effectFn();
  }
  return effectFn;
}
// •	cleanup：在执行副作用函数之前，先清理上一次的依赖关系。
// •	activeEffect：设置当前激活的副作用函数，便于在 track 函数中进行依赖收集。
// •	deps：保存副作用函数所依赖的响应式属性。
// •	options：可选配置，比如 lazy（懒执行）等。
```

3. cleanup 函数：清理副作用函数的依赖关系，防止重复收集依赖。
```js
function cleanup(effectFn) {
  for (let i = 0; i < effectFn.deps.length; i++) {
    const dep = effectFn.deps[i];
    dep.delete(effectFn);
  }
  effectFn.deps.length = 0;
}
```

总结：

•	Reactive Objects：通过 reactive 函数创建响应式对象。
•	Effect Function：通过 effect 函数定义副作用函数，并在首次执行时进行依赖收集。
•	Track Function：在读取响应式属性时进行依赖收集。
•	Trigger Function：在响应式属性发生变化时触发依赖的副作用函数。
•	Cleanup Function：在重新执行副作用函数之前清理上一次的依赖关系。

### 一个深入理解watchEffect和JS同步与异步的小栗子

现在有一个场景，一个视频播放器的下方有加速按钮和减速按钮，实现点击加速和减速来控制视频的倍速播放

下面是代码的片段

```js
const videoRef = ref();
const speed = ref(1);

watEffect(async () => {
  const videoUrl = await fetchVideoUrl();
  videoRef.value && videoRef.value.playbackRate = speed.valuel;
})
```

在上述代码中，当speed发生变化后，视频的播放速度并没有发生变化，是什么原因导致的呢：

原因就在于：watEffect收集依赖的步骤是：
1. 打开收集依赖的开关
2. 执行传入的函数
3. 函数内部读取响应式数据，触发其get方法，将这个函数注册到响应式数据的观察者池子里
4. 关闭依赖收集的开关

这里关键点在于，上述步骤在代码实现层面是**同步代码**，但是我们在watEffect里却写了异步代码，而且很不幸的是，我们读取响应式数据的代码还写在了await语句的后面。

watEffect在收集依赖阶段执行函数并不会等你内部的异步函数执行完毕，因此这里压根没有读取响应式数据，导致没能成功收集依赖，也就导致后续响应式数据发生变化后并不会执行这个函数

因此一般情况下，不建议在watchEffect中使用异步代码，尤其需要注意，一定不能将读取响应式数据的代码变成异步代码

如果确实需要异步，建议使用watch代替watchEffect

## watch和computed

### 用途
- watch：侦测一个或多个响应式数据源并在数据源变化时调用一个回调函数
- watchEffect：立即运行一个函数，然后被动地追踪它的依赖，当这些依赖改变时重新执行该函数
- computed：用于声明计算属性，它们基于依赖的响应式数据自动计算值。**具有缓存特性**，只有在依赖的数据变化时才会重新计算。

### 用法
1. computed ：在 Vue 3 中，computed 是基于 effect 和 getter 实现的。计算属性会自动追踪其依赖的数据，并在依赖发生变化时重新计算。

```js
import { reactive, computed, effect } from 'vue';

const state = reactive({
  a: 1,
  b: 2
});

const sum = computed(() => {
  return state.a + state.b;
});

effect(() => {
  console.log(sum.value); // 输出计算属性的值
});

// •	computed 函数：创建一个计算属性，并返回一个包含 value 属性的对象。
// •	缓存机制：计算属性的值会被缓存，只有在依赖的数据变化时才会重新计算。
// •	依赖追踪：通过 effect 函数，计算属性的依赖会被自动追踪，当依赖发生变化时，计算属性会重新计算。
```

2. watch：基于 effect 和回调函数实现的。它会在指定的响应式数据变化时执行相应的回调。

```js
import { reactive, watch } from 'vue';

const state = reactive({
  a: 1,
  b: 2
});

watch(() => state.a, (newVal, oldVal) => {
  console.log(`a changed from ${oldVal} to ${newVal}`);
});

// •	watch 函数：接受一个 getter 函数和一个回调函数，当 getter 函数返回的值发生变化时，回调函数会被调用。
// •	依赖追踪：通过 effect 函数，watch 会自动追踪 getter 函数中的依赖，当依赖发生变化时，回调函数会被执行。
```

### 实现原理
1. computed

这是一个非常重要的 API，用于创建计算属性。计算属性类似于 Vue 2 中的计算属性，但在 Vue 3 中，computed 是通过一个新的响应式系统实现的。这个响应式系统的核心是 reactivity 模块，包括 reactive、ref、effect 等 API。

computed 的实现主要依赖于 Vue 3 的响应式系统，尤其是 effect 和 ReactiveEffect 类。

下面通过一个例子，从computed数据所引用的响应式数据发生改变，到页面更新的整个过程，来详细讲述一下他的运作原理

**假设我们有以下代码：**

```js
import { reactive, computed, createApp } from 'vue';

const state = reactive({ a: 1, b: 2 });

const sum = computed(() => state.a + state.b);

const app = createApp({
  template: `<div>{{ sum }}</div>`,
  setup() {
    return { sum };
  }
});

app.mount('#app');
```

**创建响应式数据**

首先，我们通过 reactive 创建了一个响应式对象 state：

```js
const state = reactive({ a: 1, b: 2 });
```

reactive 函数返回一个 Proxy 对象，用于拦截对 state 对象的读取和写入操作。

**创建计算属性**

接着，我们通过 computed 创建了一个计算属性 sum：

```js
const sum = computed(() => state.a + state.b);
```

computed 函数的实现如下：

```js
import { ReactiveEffect } from '@vue/reactivity';

function computed(getter) {
  let value;
  let dirty = true;

  const effect = new ReactiveEffect(() => {
    value = getter();
  }, () => {
    if (!dirty) {
      dirty = true;
      trigger(obj, 'value');
    }
  });

  const obj = {
    get value() {
      if (dirty) {
        effect.run();
        dirty = false;
        track(obj, 'value');
      }
      return value;
    }
  };

  return obj;
}
```

**创建 ReactiveEffect：**
在 computed 函数中，创建了一个 ReactiveEffect 实例，并将计算属性的 getter 包装成副作用函数：

ReactiveEffect 会将当前的 activeEffect 设置为自身，并在执行 getter 时进行依赖收集（这个是核心）

```js
class ReactiveEffect {
  constructor(fn, scheduler = null) {
    this.fn = fn;
    this.scheduler = scheduler;
    this.active = true;
    this.deps = [];
  }

  run() {
    if (!this.active) {
      return this.fn();
    }
    activeEffect = this;
    shouldTrack = true;
    const result = this.fn();
    shouldTrack = false;
    activeEffect = undefined;
    return result;
  }

  stop() {
    if (this.active) {
      cleanupEffect(this);
      this.active = false;
    }
  }
}
```
**依赖收集**
computed 函数使用了一个 dirty 标志来跟踪计算属性是否需要重新计算。初始时，dirty 被设置为 true，表示需要计算。当我们访问计算属性的值时，如果 dirty 是 true，则运行 effect.run() 并更新 value，然后将 dirty 设置为 false，否则，就读取已经缓存的value值，这就是computed值具有缓存特性的来源

当依赖的数据发生变化时，effect 的调度器（即上面的 scheduler）会被调用，它会将 dirty 标志重新设置为 true，表示计算属性需要重新计算。

```js
if (dirty) {
  value = effect.run();
  dirty = false;
  track(obj, 'value');
}
```

effect.run() 会执行 getter 函数，此时会访问 state.a 和 state.b，触发响应式数据的 get 拦截器，从而进行依赖收集。

响应式数据的 get 拦截器会调用 track 函数：

**track 函数会将当前的 activeEffect（即计算属性的 ReactiveEffect 实例）添加到 state.a 和 state.b 的依赖列表中。**

```js
const mutableHandlers = {
  get(target, key, receiver) {
    const res = Reflect.get(target, key, receiver);
    track(target, key);
    return res;
  },
  set(target, key, value, receiver) {
    const oldValue = target[key];
    const result = Reflect.set(target, key, value, receiver);
    if (oldValue !== value) {
      trigger(target, key);
    }
    return result;
  }
};

function track(target, key) {
  if (!shouldTrack || !activeEffect) return;

  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
  }
}
```

**触发更新**

当 state.a 或 state.b 的值发生变化时，会触发响应式数据的 set 拦截器：

```js
const mutableHandlers = {
  get(target, key, receiver) {
    const res = Reflect.get(target, key, receiver);
    track(target, key);
    return res;
  },
  set(target, key, value, receiver) {
    const oldValue = target[key];
    const result = Reflect.set(target, key, value, receiver);
    if (oldValue !== value) {
      trigger(target, key);
    }
    return result;
  }
};

function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;
  const dep = depsMap.get(key);
  if (dep) {
    dep.forEach(effect => {
      if (effect.scheduler) {
        effect.scheduler();
      } else {
        effect.run();
      }
    });
  }
}
```

trigger 函数会通知所有依赖于 state.a 或 state.b 的 ReactiveEffect 实例，调用它们的调度器（scheduler）。

在 computed 的实现中，调度器会将 dirty 标志重新设置为 true，从而在下次访问计算属性的值时重新计算：

```js
const effect = new ReactiveEffect(() => {
  value = getter();
}, () => {
  if (!dirty) {
    dirty = true;
    trigger(obj, 'value');
  }
});
```

**模板更新**

在 Vue 3 的模板中使用 sum 计算属性时，模板会依赖于 sum.value。当计算属性的值发生变化时，会触发依赖于 sum.value 的所有副作用（如模板更新）。

Vue 3 内部会通过一个渲染函数来管理模板依赖的响应式数据，当 sum.value 发生变化时，渲染函数会被重新执行，从而更新模板

2. watch

```js
function watch(source, cb) {
  let getter;

  if (typeof source === 'function') {
    getter = source;
  } else {
    getter = () => traverse(source);
  }

  let oldValue, newValue;

  const effect = new ReactiveEffect(() => getter(), () => {
    newValue = effect.run();
    cb(newValue, oldValue);
    oldValue = newValue;
  });

  oldValue = effect.run();
}

function traverse(value, seen = new Set()) {
  if (typeof value !== 'object' || value === null || seen.has(value)) return;
  seen.add(value);
  for (const key in value) {
    traverse(value[key], seen);
  }
  return value;
}

	// •	getter 函数：用于获取要监测的响应式数据。
	// •	ReactiveEffect：用于处理依赖收集和副作用函数的执行。
	// •	依赖追踪和触发：通过 ReactiveEffect 类，watch 会自动追踪 getter 函数中的依赖，并在依赖变化时执行回调函数。
```
## ref和reactive

- reactive用于处理对象类型的数据响应式，底层采用的是new Proxy( )，但解构会丧失响应式
- ref通常用于处理单值的响应式，ref主要解决原始值的响应式问题，底层采用的是Object.defineProperty( )实现的，基本类型包装成对象

# 生命周期

Vue 的生命周期钩子函数为开发者提供了在组件特定阶段执行代码的机会。Vue 3 相对于 Vue 2 引入了一些新的生命周期钩子，并对部分钩子进行了重命名或调整

## Vue 3 的生命周期钩子
1.	beforeCreate -> setup()
2.	created -> setup()
3.	beforeMount -> onBeforeMount
4.	mounted -> onMounted
5.	beforeUpdate -> onBeforeUpdate
6.	updated -> onUpdated
7.	beforeDestroy -> onBeforeUnmount
8.	destroyed -> onUnmounted
9.	errorCaptured -> onErrorCaptured
10.	renderTracked -> onRenderTracked
11.	renderTriggered -> onRenderTriggered

Vue 3 还引入了组合式 API（Composition API），允许开发者在 setup 函数中通过组合式 API 注册生命周期钩子。

## Vue 2 与 Vue 3 生命周期对比
|阶段	|Vue 2|	Vue 3|
| :--------  | :-----  | :----:  |
创建组件之前|	beforeCreate	|setup()
创建组件之后|	created|	setup()
挂载组件之前	|beforeMount	|onBeforeMount
挂载组件之后|	mounted|	onMounted
更新组件之前|	beforeUpdate|	onBeforeUpdate
更新组件之后|	updated	|onUpdated
卸载组件之前	|beforeDestroy|	onBeforeUnmount
卸载组件之后|	destroyed|	onUnmounted
keep-alive 缓存的组件激活时 | activated | activated
keep-alive 缓存的组件停用时 | deactivated | deactivated
捕获错误|	errorCaptured	|onErrorCaptured
渲染跟踪|	renderTracked|	onRenderTracked
渲染触发	|renderTriggered	|onRenderTriggered
服务器渲染前调用	|serverPrefetch	|serverPrefetch

# Vue3和Vue2

## 主要区别

- Vue3更注重模块上的拆分，在Vue2中无法单独使用部分模块。需要引入完整的Vue.js，而Vue3中模块之间耦合度低，模块可以独立使用
- Vue2中很多方法挂载得到了实例中导致没有使用也会被打包（还有很多组件也是）。通过构建工具tree-shaking机制实现按需引入，减少用户打包后体积
- 在Vue3中允许自定义渲染器，扩展能力强。不会发生以前的事情，改写Vue源码改造渲染方式。扩展更方便
- 在Vue2使用defineProperty来进行数据的劫持，需要对属性进行重写添加getter和setter，性能差
- 当新增属性和删除属性时无法监控变化。需要通过$set、$delete
- 数组不采用defineProperty来进行劫持（浪费性能，对所有索引进行劫持造成性能浪费）需要对数组单独进行处理
- diff算法进行了优化，同序列比对和最长递增子序列
- Vue3中模板编译优化，采用PatchFlags优化动态节点，采用BlockTree进行靶向更新
- 相比Vue2来说Vue3新增了很多新的特性
- 最重要的变化是组合式API

## Vue3中CompositionAPI的优势
- 在Vue2中采用的是OptionsAPI，需要用户自己提供data，props，methods，computed，watch等属性，用户编写复杂业务逻辑会出现反复横跳的问题，上下滚动查看
- Vue2中所有的属性都是通过this访问，this存在指向不明确的问题
- Vue2中很多未使用方法或属性依旧会被打包，并且所有全局API都在Vue对象上公开。而组合式API对tree-shaking更加友好，代码也更容易压缩，用到才会导入，没有则不导入
- 组件逻辑共享问题，Vue2中采用mixins实现组件之间的逻辑共享，但是会有数据来源不明确，命名冲突的问题。Vue3中采用组合式API提取公共逻辑非常方便
- 简单组件仍然可以采用选项是API进行编写，组合式API在复杂的逻辑中有着明显的优势

## Vue3中模板编译优化

**PatchFlags优化**

diff算法无法避免新旧虚拟DOM中无用的比较操作，如：静态节点。通过patchFlags来标记动态内容，可以实现快速diff算法。此时生成的虚拟节点多出一个dynamicChildren属性，这个就是block的作用，block可以收集所有后代动态节点。这样后续更新时可以直接跳过静态节点，实现靶向更新。当然了，这的前提是节点个数要一样，如v-for，之前数组为3，之后为5个，则使用diff全量更新

**BlockTree**

为什么要提出blockTree的概念？问题出在block在收集动态节点时是忽略虚拟DOM树层级的

```js
<div>
    <p v-if="flag">
        <span>{{a}}</span>
    </p>
    <div v-else>
        <span>{{a}}</span>
    </div>
</div>

```

这时候切换flag的状态将无法从p标签切换到div标签
解决方案：就是将不稳定的结构也当作block来进行处理
所谓不稳定结构就是DOM树的结构可能会发生变化，如：v-if、v-for、Fragment

**静态提升**

静态提升的节点都是静态的，可以将提升出来的节点字符化。当连续静态节点超过20时，会将静态节点序列化为字符串

**缓存函数**

开启函数缓存后，函数会被缓存起来，后续可以直接使用


# vue使用层面的一些理解

## Vue.set(Vue2)

> Vue不允许在已经创建的实例上直接动态地添加新的响应式数据属性，因此推出这个API来为响应式对象添加属性

开发环境下，set的第一个参数target若没定义或是基础类型则报错
如果是数组，则调用重写的splice方法，这样可以更新视图
如果是对象本身的属性，则直接添加即可
如果是Vue实例或根数据data时报错，更新_data无意义

## Vue.observable（Vue2）

在非父子组件通信时，可以使用eventBus或者使用状态管理工具，但是功能不复杂的时候，可以使用Vue.observable，创建一个响应式对象，来实现数据共享

这一功能在vue3中使用ref和reactive创建共享全局状态来替代了

```js
import { ref } from 'vue';

const sharedState = ref(0);

export function useSharedState() {
  const increment = () => {
    sharedState.value++;
  };

  return {
    sharedState,
    increment
  };
}
```

## v-if和v-for的优先级

v-for和v-if避免在同一个标签中使用。如果遇到需要同时使用时可以考虑写成计算属性的方式

在Vue2解析时，先解析v-for，再解析v-if。会导致先循环后在对每一项进行判断，浪费性能

在Vue3解析时，v-if的优先级高于v-for

## Vue.use(Vue2)

在vue3中改为了app.use()

安装Vue.js插件时，如果插件是一个对象，必须提供install方法。如果插件是一个函数，它会被作为install方法。install方法调用时，会将Vue作为参数传入，这样插件中就不需要依赖Vue了。如：Vuex，Vue-Router

- 添加全局指令、全局过滤器、全局组件
- 通过全局混入来添加一些组件选项

```js
Vue.use = function(plugin:Function | Object){
    //插件缓存
    const installedPlugins = this._installedPlugins || (this._installedPlugins = [])
    if(installedPlugins.indexOf(plugin) > -1){
        //如果已经有插件，直接返回
        return this
    }

    //添加参数
    const args = toArray(arguments, 1) //除了第一项，其它的参数整合成数组
    args.unshift(this) //将Vue放入数组中
    if(typeof plugin.install === 'function'){
        //调用install方法
        plugin.install.apply(plugin, args)
    }else if(typeof plugin === 'function'){
        //直接调用方法
        plugin.apply(null, args)
    }
    installedPlugins.push(plugin) //缓存插件
    return this
}
```

## extend

使一个组件可以继承另一个组件的组件选项。

从实现角度来看，extends 几乎和 mixins 相同。通过 extends 指定的组件将会当作第一个 mixin 来处理。

然而，extends 和 mixins 表达的是不同的目标。mixins 选项基本用于组合功能，而 extends 则一般更关注继承关系。

同 mixins 一样，所有选项 (setup() 除外) 都将使用相关的策略进行合并。

>不建议用于组合式 API

>extends 是为选项式 API 设计的，不会处理 setup() 钩子的合并。

>在组合式 API 中，逻辑复用的首选模式是“组合”而不是“继承”。如果一个组件中的逻辑需要复用，考虑将相关逻辑提取到组合式函数中。

>如果你仍然想要通过组合式 API 来“继承”一个组件，可以在继承组件的 setup() 中调用基类组件的 setup()：

```js
import Base from './Base.js'
export default {
  extends: Base,
  setup(props, ctx) {
    return {
      ...Base.setup(props, ctx),
      // 本地绑定
    }
  }
}
```

## vue中的data为什么是函数

- 根实例对象data可以是对象也可以是函数“单例”，不会产生数据污染情况
- 组件实例对象data必须为函数，目的是为了防止多个组件实例对象之间共用一个data，产生数据污染，所以要通过工厂函数返回全新的data作为组件数据源

## 函数式组件的优势

- 函数组件的特性：无状态、无生命周期、无this，但是性能高。正常组件是一个类继承了Vue，函数式组件就是普通的函数，没有new的过程。
- 最终就是将返回的虚拟DOM变成真实DOM替换对应的组件
- 函数式组件不会被记录在组件的父子关系中
- **在Vue3中因为所有的组件都不用new了，所以在性能上没有了优势**

## v-once

v-once是Vue中内置指令，只渲染元素和组件一次。随后的重新渲染，元素/组件及其所有的子节点将被视为静态内容并跳过。这可以用于优化更新性能。
 
可用在：单个元素、父节点、组件、列表
 
vue3.2之后，增加了v-memo指令，通过依赖列表的方式控制页面渲染，如果依赖的属性(valueA,valueB)没有改变，则默认渲染缓存的结果，类似于计算属性

```js
<div>
    <div v-memo="[valueA,valueB]">
        <div class="box" v-for="item in arr" :key="item">{{item}}</div>
    </div>
</div>
```

当组件重新渲染，如果 valueA 和 valueB 都保持不变，这个 div 及其子项的所有更新都将被跳过。实际上，甚至虚拟 DOM 的 vnode 创建也将被跳过，因为缓存的子树副本可以被重新使用。

正确指定缓存数组很重要，否则应该生效的更新可能被跳过。v-memo 传入空依赖数组 (v-memo="[]") 将与 v-once 效果相同。

v-memo 仅用于性能至上场景中的微小优化，应该很少需要。最常见的情况可能是有助于渲染海量 v-for 列表 (长度超过 1000 的情况)：

```js
<div v-for="item in list" :key="item.id" v-memo="[item.id === selected]">
  <p>ID: {{ item.id }} - selected: {{ item.id === selected }}</p>
  <p>...more child nodes</p>
</div>
```

当组件的 selected 状态改变，默认会重新创建大量的 vnode，尽管绝大部分都跟之前是一模一样的。v-memo 用在这里本质上是在说“只有当该项的被选中状态改变时才需要更新”。这使得每个选中状态没有变的项能完全重用之前的 vnode 并跳过差异比较。注意这里 memo 依赖数组中并不需要包含 item.id，因为 Vue 也会根据 item 的 :key 进行判断。

>警告：当搭配 v-for 使用 v-memo，确保两者都绑定在同一个元素上。v-memo 不能用在 v-for 内部。

## Vue.mixin

mixin可以用来扩展组件，将公共逻辑进行抽离。在需要改逻辑时进行“混入”，采用策略模式针对不同的属性进行合并。如果混入的数据和本身组件中的数据冲突，会采用“就近原则”以组件的数据为准。
 
mixin（换入对象）中有很多缺陷：“命名冲突问题”，“数据来源问题”

Vue3中采用hook函数替代了mixin

## vue3组合式函数

在 Vue 应用的概念中，“组合式函数”(Composables) 是一个利用 Vue 的组合式 API 来封装和复用有状态逻辑的函数。

当构建前端应用时，我们常常需要复用公共任务的逻辑。例如为了在不同地方格式化时间，我们可能会抽取一个可复用的日期格式化函数。这个函数封装了无状态的逻辑：它在接收一些输入后立刻返回所期望的输出。复用无状态逻辑的库有很多，比如你可能已经用过的 lodash 或是 date-fns。

相比之下，有状态逻辑负责管理会随时间而变化的状态。一个简单的例子是跟踪当前鼠标在页面中的位置。在实际应用中，也可能是像触摸手势或与数据库的连接状态这样的更复杂的逻辑。

```js
// mouse.js
import { ref, onMounted, onUnmounted } from 'vue'

// 按照惯例，组合式函数名以“use”开头
export function useMouse() {
  // 被组合式函数封装和管理的状态
  const x = ref(0)
  const y = ref(0)

  // 组合式函数可以随时更改其状态。
  function update(event) {
    x.value = event.pageX
    y.value = event.pageY
  }

  // 一个组合式函数也可以挂靠在所属组件的生命周期上
  // 来启动和卸载副作用
  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  // 通过返回值暴露所管理的状态
  return { x, y }
}
```

```js
<script setup>
import { useMouse } from './mouse.js'

const { x, y } = useMouse()
</script>

<template>Mouse position is at: {{ x }}, {{ y }}</template>
```

## slot插槽

插槽设计来源于Web Components规范草案，利用slot进行占位，在使用组件时，组件标签内部内容会分发到对应的slot中

通过插槽可以让用户更好的对组件进行扩展和定制化。可以通过具名插槽指定渲染的位置，常用的组件例如：弹框组件、布局组件、表格组件、树组件…

插槽的分类和原理
- 默认插槽
- 具名插槽
- 作用域插槽

普通插槽，渲染在父级；作用域插槽，渲染在组件内部

**渲染作用域**
插槽内容可以访问到父组件的数据作用域，因为插槽内容本身是在父组件模板中定义的。举例来说：

```js
<span>{{ message }}</span>
<FancyButton>{{ message }}</FancyButton>
```
这里的两个 {{ message }} 插值表达式渲染的内容都是一样的。

但是插槽内容无法访问子组件的数据。

```js
<span>{{ message }}</span>
<FancyButton><son></son></FancyButton>
```
FancyButton中无法读取son的数据

Vue 模板中的表达式只能访问其定义时所处的作用域，这和 JavaScript 的词法作用域规则是一致的。换言之：父组件模板中的表达式只能访问父组件的作用域；子组件模板中的表达式只能访问子组件的作用域。

然而在某些场景下插槽的内容可能想要同时使用父组件域内和子组件域内的数据。要做到这一点，我们需要一种方法来让子组件在渲染时将一部分数据提供给插槽。我们也确实有办法这么做！可以像对组件传递 props 那样，向一个插槽的出口上传递

```js
// <MyComponent>
<div>
  <slot :text="greetingMessage" :count="1"></slot>
</div>
```
当需要接收插槽 props 时，默认插槽和具名插槽的使用方式有一些小区别。下面我们将先展示默认插槽如何接受 props，通过子组件标签上的 v-slot 指令，直接接收到了一个插槽 props 对象：
```js
<MyComponent v-slot="slotProps">
  {{ slotProps.text }} {{ slotProps.count }}
</MyComponent>
```

```js
MyComponent({
  // 类比默认插槽，将其想成一个函数
  default: (slotProps) => {
    return `${slotProps.text} ${slotProps.count}`
  }
})

function MyComponent(slots) {
  const greetingMessage = 'hello'
  return `<div>${
    // 在插槽函数调用时传入 props
    slots.default({ text: greetingMessage, count: 1 })
  }</div>`
}
```

## v-model的参数

组件上的 v-model 也可以接受一个参数：

```js
<MyComponent v-model:title="bookTitle" />
```

在这种情况下，子组件应该使用 title prop 和 update:title 事件来更新父组件的值，而非默认的 modelValue prop 和 update:modelValue 事件：

```js
// MyComponent.vue
<script>
export default {
  props: ['title'],
  emits: ['update:title']
}
</script>

<template>
  <input
    type="text"
    :value="title"
    @input="$emit('update:title', $event.target.value)"
  />
</template>
```

## vue的其他修饰符

表单修饰符：lazy、trim、number
事件修饰符：stop、prevent、self、once、capture、passive、native
鼠标按键修饰符：left、right、middle
键值修饰符对keyCode处理
.sync修饰符

## Vue中异步组件

Vue允许你以一个工厂函数的方式定义你的组件，这个工厂函数会异步解析你的组件定义。推荐做法是将异步组件和webpack的code-splitting功能一起配合使用。

主要用于大组件的拆分，在路由中也是经常使用的

回调写法：

```js
{
   components:{
       "my-component":(resolve,reject)=>{
           setTimeout(function(){
               resolve({
                   render(h){
                       return h('div','hello')
                   }
               })
           },1000)
        }
    }
}
```

promise写法：
```js
{
  components:{
       "my-component":()=>import("./components/test.vue")
   }
}
```

对象写法
```js
const AsyncComponent = () =>({
    // 需要加载的组件（应该是一个promise对象）
    component:import("./MyComponent.vue"),
    // 异步组件加载时使用的组件
    loading:LoadingComponent,
    // 加载失败时使用的组件
    error:ErrorComponent,
    // 展示加载时组件的延时时间，默认是200毫秒
    delay:200,
    // 如果提供了超时时间且组件加载也超时了，则使用加载失败时使用的组件，默认是：‘Infinity’
    timeout:3000,
})
```

异步组件原理：
默认渲染异步占位符节点
组件加载完毕后调用$forceUpdate强制更新，渲染加载完毕后的组件

## nextTick

- Vue中视图更新是异步的，使用nextTick方法可以保证用户定义的逻辑在更新后执行
- 可用于获取更新后的DOM。多次调用nextTick会被合并
- nextTick本身不是异步的方法

```js
<template>
    <div id="counter">{{count}}</div>
</template>

<script>
    export default {
        name:'App',
        components:{},
        data(){
            return {
                count:0
            }
        }
        mounted(){
            // [flush刷新页面，用户定义]
            this.count = 100
            this.$nextTick(()=>{
                console.log(document.getElementById("counter").innerHTML)
            })
        }
    }
</script>
```

nextTick原理:

作用是底层就是一个批处理，把用户定义和内置的flush刷新都放到一个数组里，依次去执行。上述代码中先运行了内置的flush刷新页面，因此可以获取到更新后的数值，若把this.$nextTick( )放到上面，则其值为0

## keep-alive

keep-alive是Vue中内置组件，能在组件切换过程中缓存组件的实例，而不是销毁它们。
在组件再次更新激活时可通过缓存的实例，拿到之前渲染的DOM进行渲染，无需重新生成节点。

使用场景：

**动态组件可以采用keep-alive进行缓存**

```js
<keep-alive :include="whiteList" :exclude="blackList" :max="count">
    <component :is="component"></component>
</keep-alive>
```

**在路由中使用keep-alive**

```js
<keep-alive :include="whiteList" :exclude="blackList" :max="count">
    <router-view></router-view>
</keep-alive>
```

**也可以通过meta属性指定那些页面需要缓存，哪些不需要**

```js
<div id="app">
    <keep-alive>
        <!-- 需要缓存的视图组件 -->
        <router-view v-if="Sroute.meta.keepAlive"></router-view>
    </keep-alive>
    <!-- 不需要缓存的视图组件 -->
    <router-view v-if="!Sroute.meta.keepAlive"></router-view> 
</div>
```

keep-alive原理:

超过了最大max数量，会保存最近要缓存的组件实例，移除最初缓存的组件
最近最久未使用算法LRU
定义一个缓存映射对象和缓存key，缓存了就不会再初始化了

keep-alive中数据更新问题:

由于缓存不再初始化了，因此一些created、mounted、updated钩子不再触发,组件数据发生变化了，也不会更新，而是采用上次缓存的结果。有以下两种解决方案：

1. beforeRouteEnter：在有Vue-Router的项目，每次进入路由的时候，都会执行beforeRouteEnter
2. activated：在keep-alive缓存的组件被激活的时候，都会执行activated钩子.

```js
activated(){
	this.getData() //获取数据
}
```

## Vue中使用了那些设计模式

- 单例模式：整个程序有且仅有一个实例，如：Vuex中的store
- 工厂模式：传入参数即可创建实例，如：createElement方法
- 发布订阅模式：订阅者把自己想订阅的事件注册到调度中心，当该事件触发的时候，发布者发布该事件到调度中心，由调度中心统一调度订阅者注册到调度中心的处理代码，如：事件绑定和事件触发、EventBus
- 观察者模式：watcher & dep的关系，自动不用手动触发
- 代理模式：给某一个对象提供一个代理对象，并由代理对象控制对原对象的引用
- 装饰模式：Vue2中装饰器的用法，对功能进行增强@
- 中介模式：一个行为设计，通过提供一个统一的接口让系统的不同部分进行通信，如Vuex
- 策略模式：对象有某个行为，但是在不同的场景中，该行为有不同的实现方案
- 外观模式：提供了统一的接口，用来访问子系统中的一群接口

## Vue中的性能优化

- 数据层级不易过深，合理设置响应式数据
- 通过Object.freeze( )方法冻结属性
- 使用数据时缓存值的结果，不频繁取值
- 合理设置key属性
- v-show和v-if的选取
- 控制组件粒度 --> Vue采用组件级更新
- 采用异步组件 --> 借助webpack分包的能力
- 采用函数式组件 --> 函数式组件开销低
- 使用keep-alive缓存组件
- 使用v-once
- 分页、虚拟滚动、时间分片等策略

## Vue项目中Axios封装的通用模板

- 设置请求超时时间
- 根据项目环境设置请求路径
- 设置请求拦截器，自动添加token
- 设置响应拦截器，对响应的状态码或数据进行格式化
- 增添请求队列，实现loading效果
- 维护取消请求token，在页面切换时通过导航守卫取消上个页面中正在发送的请求

## Vue-Router中钩子及流程

导航被触发
在失活的组件里调用beforeRouteLeave守卫
调用全局的beforeEach守卫
在重用的组件里调用beforeRouteUpdate守卫（2.2+）
在路由配置里调用beforeEnter
解析异步路由组件
在被激活的组件里调用beforeRouteEnter
调用全局的beforeResolve守卫（2.5+）
导航被确认
调用全局的afterEach钩子
触发DOM更新
调用beforeRouteEnter守卫中传给next的回调函数，创建好的组件实例会作为回调函数的参数传入

## Vue-Router几种模式

Vue-Router有三种模式：hash、history、abstract
- abstract模式是在不支持浏览器API环境使用，不依赖于浏览器历史记录
- hash模式兼容性好但不够美观，hash服务端无法获取，不利于SEO优化。hash+popState/hashChange
- history模式美观且支持服务端渲染，但刷新会出现404问题，可使用插件CLI webpack history-fallback。historyApi+popState

# Vuex

## vuex的概念
Vuex是一个专门为Vue.js应用程序开发的状态管理模式。采用集中式存储管理应用的所有组件状态。核心就是解决数据的共享问题。
以响应的规则保证状态以一种可预测的方式发生变化。

## 状态修改
组件中commit( ) --> mutation --> 修改状态
组件中dispatch( ) --> action --> commit( ) --> mutation --> 修改状态

## 缺点
Vue中store只有一份，复杂的数据需要依赖于模块。Vuex状态是一个树形结构，最终会将模块的状态挂载到跟模块上。

- 模块和状态的名字冲突
- 数据不够扁平化、调用的时候过长
- 更改状态mutation和action的选取
- 模块需要增加namespaced
- 对TS支持并不友好

## 原理
对于Vuex3核心就是通过new Vue( )创建了一个Vue实例，进行数据共享
对于Vuex4核心就是通过一个响应式对象进行数据共享，reactive( )

## 监听数据变化
通过watch监控Vuex中状态的变化
通过store.subscribe监控状态变化

## 页面刷新后Vuex的数据丢失怎么解决
每次获取数据前检测Vuex数据是否存在，不存在则发情求重新拉取数据，存储到Vuex中
采用Vuex持久化插件，将数据存储到localStorage或sessionStorage中

## mutation和action的区别
- 在action中可以处理异步逻辑，可以获取数据后将结果提交给mutation，而mutation则是修改state
- 在action中可以多次进行commit操作，包括action中也可以调用action
- 在非mutation中修改数据，在严格模式下会发生异常
- dispatch时会将action包装成promise，而mutation则没进行包装

## 为什么mutation是同步的，action是异步的，这样设计的初衷是什么
Vuex 的 mutation 本质上是同步的，它不支持异步操作。这是因为 mutation 的设计初衷就是为了使状态的变更过程变得简单和可追踪。因此，Vuex 强制 mutation 必须是同步的，以保证状态的一致性和可预测性。

但是在实际的开发中，我们经常需要进行异步操作，例如从服务器获取数据。这就是为什么 Vuex 引入了 actions 的概念。

总结：Vuex 的 mutation 不能是异步的，因为这会使得状态变更变得难以追踪和调试。actions 则提供了一个处理异步操作的地方，在异步操作完成后再通过提交 mutation 来更新状态，从而保证了状态变更的同步性和可预测性。因此，即使可以在 mutation 中进行异步操作（例如使用 async/await），这也是不推荐的做法，官方文档也明确指出 mutation 必须是同步的。

## Vuex中的module在什么情况下使用

使用单一状态时，应用的所有状态会集中到一个比较大的对象。当应用变得非常复杂时，store对象就有可能变得相当臃肿。
Vuex允许将store分割成模块(module)。每个模块拥有自己的state、mutation、action、getter，甚至是嵌套子模块。

```js
const moduleA = {
    state: () =>  ({ ...  }),
    mutations: {...  },
    actions: {...  },
    getters: {... }
}
const moduleB = {
    state: () =>  ({ ...  }),
    mutations: { ... },
    actions: {...  }
}
const store = createStore({
    modules: {
        a: modulA,
        b: moduleB
    }
})

store.state.a // moduleA 的状态
store.state.b // moduleB 的状态
```

# Vue-route

