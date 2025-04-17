---
date: 2020-07-30
categories: [技术,前端,JavaScript]
toc: true
---

# 认识离线应用
你的网页性能优化的再好，如果网络不好那也会导致网页的体验差。 离线应用是指通过离线缓存技术，让资源在第一次被加载后缓存在本地，下次访问它时就直接返回本地的文件，就算没有网络连接。

离线应用有以下优点：

- 在没有网络的情况下也能打开网页。
- 由于部分被缓存的资源直接从本地加载，对用户来说可以加速网页加载速度，对网站运营者来说可以减少服务器压力以及传输流量费用。

离线应用的核心是离线缓存技术，历史上曾先后出现2种离线离线缓存技术，它们分别是：

- AppCache 又叫 Application Cache，目前已经从 Web 标准中删除，请尽量不要使用它。
- Service Workers 是目前最新的离线缓存技术，是 Web Worker 的一部分。 它通过拦截网络请求实现离线缓存，比 AppCache 更加灵活。它也是构建 PWA 应用的关键技术之一。

Service Workers 相比于 AppCache 来说更加灵活，因为它可以通过 JavaScript 代码去控制缓存的逻辑。 

<!-- more -->

# 认识 Service Workers
Service Workers 是一个在浏览器后台运行的脚本，它生命周期完全独立于网页。它无法直接访问 DOM，但可以通过 postMessage 接口发送消息来和 UI 进程通信。 拦截网络请求是 Service Workers 的一个重要功能，通过它能完成离线缓存、编辑响应、过滤响应等功能。

想更深入的了解 Service Workers，推荐阅读文章服务工作线程：简介。

# Service Workers 兼容性
目前 Chrome、Firefox、Opera 都已经全面支持 Service Workers，但对于移动端浏览器就不太乐观了，只有高版本的 Android 支持。 由于 Service Workers 无法通过注入 polyfill 去实现兼容，所以在你打算使用它前请先调查清楚你的网页的运行场景。

判断浏览器是否支持 Service Workers 的最简单的方法是通过以下代码：

```javascript
// 如果 navigator 对象上存在 serviceWorker 对象，就表示支持
if (navigator.serviceWorker) {
  // 通过 navigator.serviceWorker 使用
}
```

# 注册 Service Workers
要给网页接入 Service Workers，需要在网页加载后注册一个描述 Service Workers 逻辑的脚本。 代码如下：

```javascript
if (navigator.serviceWorker) {
  window.addEventListener('DOMContentLoaded',function() {
    // 调用 serviceWorker.register 注册，参数 /sw.js 为脚本文件所在的 URL 路径
      navigator.serviceWorker.register('/sw.js');
  });
}
```

一旦这个脚本文件被加载，Service Workers 的安装就开始了。这个脚本被安装到浏览器中后，就算用户关闭了当前网页，它仍会存在。 也就是说第一次打开该网页时 Service Workers 的逻辑不会生效，因为脚本还没有被加载和注册，但是以后再次打开该网页时脚本里的逻辑将会生效。

在 Chrome 中可以通过打开网址 chrome://inspect/#service-workers 来查看当前浏览器中所有注册了的 Service Workers。

# 使用 Service Workers 实现离线缓存
Service Workers 在注册成功后会在其生命周期中派发出一些事件，通过监听对应的事件在特点的时间节点上做一些事情。

在 Service Workers 脚本中，引入了新的关键字 self 代表当前的 Service Workers 实例。

在 Service Workers 安装成功后会派发出 install 事件，需要在这个事件中执行缓存资源的逻辑，实现代码如下：

```javascript
// 当前缓存版本的唯一标识符，用当前时间代替
var cacheKey = new Date().toISOString();

// 需要被缓存的文件的 URL 列表
var cacheFileList = [
  '/index.html',
  '/app.js',
  '/app.css'
];

// 监听 install 事件
self.addEventListener('install', function (event) {
  // 等待所有资源缓存完成时，才可以进行下一步
  event.waitUntil(
    caches.open(cacheKey).then(function (cache) {
      // 要缓存的文件 URL 列表
      return cache.addAll(cacheFileList);
    })
  );
});
```

接下来需要监听网络请求事件去拦截请求，复用缓存，代码如下：

```javascript
self.addEventListener('fetch', function(event) {
  event.respondWith(
    // 去缓存中查询对应的请求
    caches.match(event.request).then(function(response) {
        // 如果命中本地缓存，就直接返回本地的资源
        if (response) {
          return response;
        }
        // 否则就去用 fetch 下载资源
        return fetch(event.request);
      }
    )
  );
});
```

以上就实现了离线缓存。

# 更新缓存
线上的代码有时需要更新和重新发布，如果这个文件被离线缓存了，那就需要 Service Workers 脚本中有对应的逻辑去更新缓存。 这可以通过更新 Service Workers 脚本文件做到。

浏览器针对 Service Workers 有如下机制：

每次打开接入了 Service Workers 的网页时，浏览器都会去重新下载 Service Workers 脚本文件（所以要注意该脚本文件不能太大），如果发现和当前已经注册过的文件存在字节差异，就将其视为“新服务工作线程”。

新 Service Workers 线程将会启动，且将会触发其 install 事件。
当网站上当前打开的页面关闭时，旧 Service Workers 线程将会被终止，新 Service Workers 线程将会取得控制权。
新 Service Workers 线程取得控制权后，将会触发其 activate 事件。
新 Service Workers 线程中的 activate 事件就是最佳的清理旧缓存的时间点，代码如下：

```javascript
// 当前缓存白名单，在新脚本的 install 事件里将使用白名单里的 key 
var cacheWhitelist = [cacheKey];

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          // 不在白名单的缓存全部清理掉
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // 删除缓存
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
```

最终完整的代码 Service Workers 脚本代码如下：

```javascript
// 当前缓存版本的唯一标识符，用当前时间代替
var cacheKey = new Date().toISOString();

// 当前缓存白名单，在新脚本的 install 事件里将使用白名单里的 key
var cacheWhitelist = [cacheKey];

// 需要被缓存的文件的 URL 列表
var cacheFileList = [
  '/index.html',
  'app.js',
  'app.css'
];

// 监听 install 事件
self.addEventListener('install', function (event) {
  // 等待所有资源缓存完成时，才可以进行下一步
  event.waitUntil(
    caches.open(cacheKey).then(function (cache) {
      // 要缓存的文件 URL 列表
      return cache.addAll(cacheFileList);
    })
  );
});

// 拦截网络请求
self.addEventListener('fetch', function (event) {
  event.respondWith(
    // 去缓存中查询对应的请求
    caches.match(event.request).then(function (response) {
        // 如果命中本地缓存，就直接返回本地的资源
        if (response) {
          return response;
        }
        // 否则就去用 fetch 下载资源
        return fetch(event.request);
      }
    )
  );
});

// 新 Service Workers 线程取得控制权后，将会触发其 activate 事件
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          // 不在白名单的缓存全部清理掉
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // 删除缓存
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
```
