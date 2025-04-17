---
date: 2020-03-09
categories: [技术,前端,HTML、浏览器综合]
thumbnail: /images/fe/iframe.jpeg
toc: true
---

# iframe的作用
<!--more-->

iframe 元素会创建包含另外一个文档的内联框架（即行内框架），简单来说就是把另一个文档用iframe给引进来

例如A页面引入B页面里面的内容

A页面：

```php
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<style>
    iframe {
        width: 300px;
        height: 300px;
        background-color: red;
        border: 0;
    }
    html * {
        margin: 0;
        padding: 0;
    }
</style>
<body>
    <iframe src="./iframe_B.html" frameborder="0" scrolling="no"></iframe>
</body>

</html>
```

B页面：

```php
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<style>
    .box {
        width: 300px;
        height: 300px;
        border: 1px solid black;
    }
</style>

<body>
    <div class="box">

    </div>
</body>

</html>
```
# iframe的一些基本属性
- frameborder:是否显示边框，0(不显示)
- height:框架作为一个普通元素的高度，建议在使用css设置。
- width:框架作为一个普通元素的宽度，建议使用css设置。
- name:框架的名称，window.frames[name]时专用的属性。
- scrolling:框架的是否滚动。yes,no,auto。
- src：内框架的地址，可以使页面地址，也可以是图片的地址。
- srcdoc , 用来替代原来HTML body里面的内容。但是IE不支持, 不过也没什么卵用
- sandbox: 对iframe进行一些列限制，IE10+支持

# iframe的优点 
- iframe能够原封不动的把嵌入的网页展现出来。
- 如果有多个网页引用iframe，那么你只需要修改iframe的内容，就可以实现调用的每一个页面内容的更改，方便快捷。
- 网页如果为了统一风格，头部和版本都是一样的，就可以写成一个页面，用iframe来嵌套，可以增加代码的可重用。
- 如果遇到加载缓慢的第三方内容如图标和广告，这些问题可以由iframe来解决。
- 可以使用iframe配合window.name和postMessage、document.domain进行跨域

# iframe的缺点
- iframe会阻塞主页面的onload事件；
- iframe和主页面共享连接池，而浏览器对相同域的连接有限制，所以会影响页面的并行加载。
- iframe框架结构有时会让人感到迷惑，如果框架个数多的话，可能会出现上下、左右滚动条，会分散访问者的注意力，用户体验度差。
- 代码复杂，无法被一些搜索引擎索引到，这一点很关键，现在的搜索引擎爬虫还不能很好的处理iframe中的内容，所以使用iframe会不利于搜索引擎优化（SEO）。
- 很多的移动设备无法完全显示框架，设备兼容性差。
- iframe框架页面会增加服务器的http请求，对于大型网站是不可取的。

关于iframe的一个问题：
有一个问题是这样问的：怎么判断一个对象a是数组
一般人应该都会想到这几个方法：
1. a instanceof Array
2. Object.prototype.toString.call('a') === '[Object  Array]'
3. Arrar.isArray()
4. a.constructor === Array;

但是今天在做题的时候遇到了一个坑：问你的是判断一个对象**最准确**的方法，按理说上面的方法都应该可以，果断全选，然后错了（害）

instanceof是不准确的

原因就是：

> **在浏览器中，我们的脚本可能需要在多个窗口之间进行交互，多个窗口意味着多个全局环境，不同的全局环境拥有不同的全局对象，从而拥有不同的内置类型构造函数**。

在这个表达式中```[] instanceof window.frames[0].Array```会返回false

就是因为：

**instanceof 操作符的问题在于，它假定只有一个全局执行环境。如果网页中包含多个【frame】框架，那实际上就存在两个以上不同的全局执行环境，从而存在两个以上不同版本的 Array 构造函数。
如果你从一个框架向另一个框架传入一个数组，那么传入的数组与在第二个框架中原生创建的数组分别具有各自不同的构造函数，在第二个框架中对传入的数组使用instanceof 操作符就会出现问题**

所以ES5中新增的Array.isArray()方法，就是为了解决这个问题

现在基本上都是用Ajax来代替iframe，所以iframe已经渐渐的退出了前端开发。
如果需要使用iframe，最好是通过javascript动态给iframe添加src属性值，这样可以绕开以上一些问题。
