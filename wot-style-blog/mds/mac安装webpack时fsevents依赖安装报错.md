---
date: 2020-07-28
categories: [技术,前端,webpack]
toc: true
---

# 安装webpack时fsevents依赖安装报错

mac安装webpack时，会同时安装fsevents，但是在安装时候发生了报错

由于后来解决了，所以没有当时的报错截图，但是和下面这个大概一致

<!-- more -->

```shell
clang: warning: using sysroot for 'iPhoneSimulator' but targeting 'MacOSX' [-Wincompatible-sysroot]
In file included from ../fsevents.cc:72:
../src/thread.cc:36:25: error: unknown type name 'ConstFSEventStreamRef'
void HandleStreamEvents(ConstFSEventStreamRef stream, void *ctx, size_t ...
                        ^
../src/thread.cc:36:108: error: unknown type name 'FSEventStreamEventFlags'
  ...stream, void *ctx, size_t numEvents, void *eventPaths, const FSEventStre...
                                                                  ^
../src/thread.cc:36:152: error: unknown type name 'FSEventStreamEventId'
  ...*eventPaths, const FSEventStreamEventFlags eventFlags[], const FSEventSt...
                                                                    ^
../src/thread.cc:54:3: error: unknown type name 'FSEventStreamContext'
  FSEventStreamContext context = { 0, ctx, NULL, NULL, NULL };
  ^
../src/thread.cc:56:3: error: unknown type name 'FSEventStreamRef'
  FSEventStreamRef stream = FSEventStreamCreate(NULL, &HandleStreamEvent...
  ^
../src/thread.cc:56:98: error: use of undeclared identifier
      'kFSEventStreamEventIdSinceNow'
  ...&HandleStreamEvents, &context, fse->paths, kFSEventStreamEventIdSinceNow...
                                                ^
6 errors generated.
make: *** [Release/obj.target/fse/fsevents.o] Error 1
gyp ERR! build error 
gyp ERR! stack Error: `make` failed with exit code: 2
gyp ERR! stack     at ChildProcess.onExit (/usr/local/lib/node_modules/npm/node_modules/node-gyp/lib/build.js:194:23)
gyp ERR! stack     at ChildProcess.emit (events.js:210:5)
gyp ERR! stack     at Process.ChildProcess._handle.onexit (internal/child_process.js:272:12)
gyp ERR! System Darwin 19.2.0
gyp ERR! command "/usr/local/bin/node" "/usr/local/lib/node_modules/npm/node_modules/node-gyp/bin/node-gyp.js" "rebuild"
gyp ERR! cwd /Users/macos/Desktop/baps_yuva/node_modules/fsevents
gyp ERR! node -v v12.14.0
gyp ERR! node-gyp -v v5.0.5
gyp ERR! not ok 
```
原文给的解决方案是安装npm的最新版本，然而我试了过后依然是一样的问题。

过程中先是遇到了xcode路径识别错误的问题。。。心想我就装个webpack，这怎么又和xcode扯上关系了。不过想一想node的编译需要基于c++和python的编译器，这需要xcode来提供，而且苹果命令行工具也和xcode有关系（至于什么关系，本mac白痴不知道，以后慢慢研究吧）。想到这些我逐渐陷入了沉思。。。

一开始下载的xcode放到了download目录，后来我把他挪到了Applications目录下，结果安装webpack就报错，因为命令行工具依然去download目录下寻找xcode，后来各种什么改xcode-select的路径试了个遍，这篇博客讲的就不错：[xcode-select切换路径无效](https://www.jianshu.com/p/472211c5cacd)。

照做之后先前报的错也解决了。但是出现了一个新错误：具体是啥我忘了，但大体的意思依然说“在download目录下没有找到xcode文件夹下的模块”之类的balabala。

![](/images/assets/20200728145038493.png)

我当时执行xcode-select -p ，看到的路径已经正确了，为什么还要去download目录下找？？？爷又没在download里面放小姐姐，这个目录就这么吸引你这个破命令行吗？？

于是我直接拷贝了一份xcode去download目录，你不是找不到吗，爷复制一份给你还不行吗！！！然后就报了上面的错

于是我索性重装了xcode和命令行工具，在终于没有报路径的错误之后我正高兴：就给我来了上面文章开头这一出。。。。

![](/images/assets/20200728144110208.png)


后来在一个github的众多issure的一个角落里发现了终极解决方案：
。
。
。
。
。
。
。
。
。
。
。
。
。
。
。
。
。
。
。
。
。
。
。
。
。
重启电脑

将信将疑，一试.......

nb！！！

![](/images/assets/20200728143503373.png)
