---
date: 2020-03-15
categories: [技术,计算机通识,数据结构与算法]
thumbnail: /images/fe/offer.jpg
toc: true
---

# 剑指offer面试题6：从尾到头打印链表
<!--more-->

输入个链表的头结点，从尾到头反过来打印出每个结点的值。

思路：由题意得，这道题需要实现的是一个“先进后出”的效果，那么实现这种效果当然需要使用栈的思想。而这道题，除了使用栈这种数据结构本身，也可以使用类似于栈的其他解决办法

先来看第一种，直接使用栈
代码如下：

```javascript
function printListFromTailToHead(head)
{
    // write code here
    let current = head
    let arr = []
    while(current){
        arr.unshift(current.val);
        current = current.next
    }
     
    return arr
}
```

如果不使用栈，还可以使用类栈的编程方法。我们知道，**递归在本质上就是一个栈的结构**。所以我们访问到一个节点时，先递归后面的节点，再输出节点本身，就实现了一个栈的效果

代码如下：

```javascript
function Print(head, arr){
    if(head === null) return []
    if(head.next !== null){
        Print(head.next, arr)
    }
    arr.push(head.val)
}
function printListFromTailToHead(head){
    let current = head
    let arr = []
    Print(current, arr)
    return arr
}

```
