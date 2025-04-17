---
date: 2020-03-16
categories: [技术,前端,HTML、浏览器综合]
thumbnail: /images/fe/yibu.jpg
toc: true
---
# 各种情况下DOMContentLoaded触发时机
在事件类型一文中我们已经知道，HTML5有一个事件名为DOMcontentLoaded，它的触发时间为：当 HTML文档被加载和解析完成

所以接下来我们了解一下HTML文档的解析过程

<!--more-->

## 在既没有CSS也没有JS的情况下，HTML文档的解析过程为：
![](/images/assets/20200316114148166.png)


## 有CSS无JS的情况下，HTML文档解析过程为：
![](/images/assets/20200316114350650.png)

渲染树的生成是基于DOM和CSSOM的。但是触发DOMContentLoaded的时间依然是在HTML解析为DOM后，无论此时CSS解析为CSSOM的过程是否完成。

## 有CSS也有JS
我们回顾一下浏览器渲染原理里面，会阻塞渲染的一种情况：

> 然后当浏览器在解析到 script 标签时，会暂停构建 DOM，完成后才会从暂停的地方重新开始。也就是说，如果你想首屏渲染的越快，就越不应该在首屏就加载 JS文件，这也是都建议将 script 标签放在 body 标签底部的原因。


![](/images/assets/20200316120226110.png)
# 异步脚本、延迟脚本与DOMContentLoaded的关系
## sync同步
HTML 文档被解析时如果遇见（同步）脚本，则停止解析，先去加载脚本，然后执行，执行结束后继续解析 HTML 文档。HTML文档解析完毕后触发DOMContentLoaded。

![](/images/assets/20200316125152818.png)
## async异步
带async的脚本一定会在load事件之前执行，可能会在DOMContentLoaded之前或之后执行。

情况1： HTML 还没有被解析完的时候，async脚本已经加载完了，那么 HTML 停止解析，去执行脚本，脚本执行完毕后触发DOMContentLoaded事件
![](/images/assets/20200316125626148.png)
情况2： HTML 解析完了之后，async脚本才加载完，然后再执行脚本，那么在HTML解析完毕、async脚本还没加载完的时候就触发DOMContentLoaded事件。如下图所示
![](/images/assets/20200316125644219.png)
总之， **DomContentLoaded 事件只关注 HTML 是否被解析完，而不关注 async 脚本。**

## defer延迟
如果 script 标签中包含 defer，那么这一块脚本将不会影响 HTML 文档的解析，而是等到 HTML 解析完成后才会执行。而 DOMContentLoaded 只有在 defer 脚本执行结束后才会被触发。

情况1：HTML还没解析完成时，defer脚本已经加载完毕，那么defer脚本将等待HTML解析完成后再执行。defer脚本执行完毕后触发DOMContentLoaded事件。如下图所示
![](/images/assets/20200316125748554.png)
情况2：HTML解析完成时，defer脚本还没加载完毕，那么defer脚本继续加载，加载完成后直接执行，执行完毕后触发DOMContentLoaded事件。如下图所示：
![](/images/assets/20200316125903411.png)
对于defer脚本，《JavaScript高级程序设计》一书的说法是:“按照h5规范，两个defer脚本会安装它们出现的先后顺序执行，两个脚本会在DOMContentLoaded之前执行。”

