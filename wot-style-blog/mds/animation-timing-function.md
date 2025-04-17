---
date: 2020-03-09
categories: [技术,前端,CSS]
thumbnail: /images/fe/atf.jpg
toc: true
---

---
# css中animation属性animation-timing-function知识点以及属性值steps()详解
在animation中最重要的其实就是时间函数（animation-timing-function）这个属性，他决定了你的动画将以什么样的速度执行，所以最关键的属性值也就是cubic-bezier(n,n,n,n),你平时用到的linear、ease、ease-out等都是基于这个属性值的，那么我们接下来就看看这个东西到底是什么含义。

这个时间函数是通过一个坐标反映出来的：
![](/images/assets/20200309173330660.png)
这个就是timing-function的工作图，总共有4个点来描述整个曲线的运动形状
<!--more-->
**其中P0和P3是开始和截止的位置，关键位置是P1和P2，那么P1的坐标(x,y)就对应了cubic-bezier(n,n,n,n)的前两个n的值，而P2的坐标对应了后两个n的值，那么整个图中就有4个点了（P0、P3永远是固定的）。**

接下来就是关键步骤了，**将P0、P1连线、P2、P3连线，此时这两条线就是整条曲线首位的切线**，然后发挥自己的想象力想一下，这两个切线固定，那么整条曲线基本就可以画出来了

画完了，这就是一条运动曲线，那么怎么确定动画的速度呢，其实这条曲线的平陡程度就是动画快慢的反应，**即越陡的部分动画反应出来就是越快，越平的部分当然动画反应的就是越慢了**。

## 普通动画介绍
那么基于这两个重要的坐标，css指定了几条常用的曲线：

- linear         ：  {-webkit-animation-timing-function:cubic-bezier(0,0,1,1);}                    （0,0,1,1）
- ease          ：  {-webkit-animation-timing-function:cubic-bezier(0.25,0.1,0.25,1);}       （0.25,0.1,0.25,1）
- ease-in      ：  {-webkit-animation-timing-function:cubic-bezier(0.42,0,1,1);}               （0.42,0,1,1）
- ease-out    ：  {-webkit-animation-timing-function:cubic-bezier(0,0,0.58,1);}               （0,0,0.58,1）
- ease-in-out：  {-webkit-animation-timing-function:cubic-bezier(0.42,0,0.58,1);}          （0.42,0,0.58,1）

后面的就是他们的坐标，你可以将cubic-bezier(n,n,n,n)设置成对应值进行动画比较，是一样的，这是你就发现其实第一个linear可以换成坐标（0.5,0.5,0.5,0.5），总之很多值都可以替换。

复习一下animation动画的属性吧：
![](/images/assets/20200309174735829.png)

