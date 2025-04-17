---
date: 2020-03-15
categories: [技术,计算机通识,数据结构与算法]
thumbnail: /images/fe/offer.jpg
toc: true
---

# 剑指offer面试题9：用两个栈实现队列
<!--more-->

题目：用两个栈实现一个队列。队列的声明如下，请实现它的两个函数push 和pop，分别完成在队列尾部插入结点和在队列头部删除结点的功能。

思路：我们知道，栈只能实现先进后出，但是队列是先进先出，对于栈来说，每次弹出的是栈顶元素，但是队列弹出的却是栈底的元素，所以我们需要用一个容器先暂存栈底元素上面的元素，然后再弹出，那么另外这个容器当然也是一个栈。

代码如下：

```javascript
let Pop = []
let Push = []
function push(node){
    while(Pop.length !== 0){
        Push.push(Pop.pop())
    }
    Push.push(node)
}
function pop(){
    while(Push.length !== 0){
        Pop.push(Push.pop())
    }
    return Pop.pop()
}
```
