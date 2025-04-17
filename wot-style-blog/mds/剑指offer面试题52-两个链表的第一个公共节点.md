---
date: 2020-03-22
categories: [技术,计算机通识,数据结构与算法]
thumbnail: /images/fe/offer.jpg
toc: true
---

# 剑指offer面试题52：两个链表的第一个公共节点
<!--more-->
这道题首先可以用暴搜，先遍历第一个链表，对于遍历到的节点再去第二个链表里面依次查找，若找到公共节点就返回。显而易见，这种方法的时间复杂度为O(m * n)， 并不是最好的解决方案

其实要寻找两个链表的第一个公共节点，就是分别从两个链表尾部向前搜索，一直搜到较短链表的头部，那么最后一次相等的节点，就是两个链表的第一个公共节点。但是单链表只能从前往后访问，于是我们可以用空间换时间的思想，利用两个栈，实现从后往前访问链表

代码如下：
```javascript
function FindFirstCommonNode(pHead1, pHead2)
{
    // write code here
    let p1 = pHead1
    let p2 = pHead2
    let stack1 = []
    let stack2 = []
    let k
    while(p1){
        stack1.push(p1)
        p1 = p1.next
    }
    while(p2){
        stack2.push(p2)
        p2 = p2.next
    }
    while(stack1.length > 0 && stack2.length > 0){
        let a = stack1.pop()
        let b = stack2.pop()
        if(a === b){
            k = a
        }
    }
    return k
}
```