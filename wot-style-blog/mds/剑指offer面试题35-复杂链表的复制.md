---
date: 2020-03-15
categories: [技术,计算机通识,数据结构与算法]
thumbnail: /images/fe/offer.jpg
toc: true
---

# 剑指offer面试题35：复杂链表的复制
<!--more-->
输入一个复杂链表（每个节点中有节点值，以及两个指针，一个指向下一个节点，另一个特殊指针指向任意一个节点），返回结果为复制后复杂链表的head。（注意，输出结果中请不要返回参数中的节点引用，否则判题程序会直接返回空）


这道题有三种方案来解决

首先第一种，是最容易想到的，但是时间复杂度为o(n^2)。先从头到尾遍历一遍原链表并复制节点和节点的next指针。然后再复制random指针，但是问题就来了，对于原链表的random，他可以指向链表中任何一个节点，那么在复制random指针过程中，对于每一个random指针，都要去新链表里面从头开始搜索，找到原链表中random指针指向的那个对象的副本，然后将新指针random指向它。所以可以看到主要耗时在寻找random指针指向的元素上面。

第二种方法，用空间换时间。在遍历原链表时就将random的对应关系先用哈希表存起来，这样时间复杂度就称为了O(n)，但空间复杂度也成了o(n)。

第三种方法：时间复杂度为O(n)， 空间复杂度为O(1)
思路：
- 第一步：仍然是根据原始链表的每个结点N 创建对应的N’。把N’链接在N的后面
![](/images/assets/20200314174053905.png)
复制后：
![](/images/assets/2020031417410963.png)
- 第二步：设置复制出来的结点的random。假设原始链表上的N的random指向结点S，那么其对应复制出来的N’是N的pext指向的结点，同样S’也是S的next指向的结点。

![](/images/assets/20200314174151914.png)

- 第三步：把这个长链表拆分成两个链表。把奇数位置的结点用next 链接起来就是原始链表，把偶数位置的结点用next 链接起来就是复制出来的链表

![](/images/assets/20200314174236529.png)
代码如下：

```javascript
function Clone(pHead)
{
    // write code here
    if(pHead === null) return null
    let current = pHead
    while(current){
        let flag = new RandomListNode(current.label)
        flag.next = current.next
        current.next = flag
        current = current.next.next
    }
    current = pHead
    while(current){
        current.next.random = current.random ? current.random.next : null
        current = current.next.next
    }
    current = pHead
    let ne = pHead.next
    while(current){
        let flag = current.next
        current.next = current.next ? current.next.next : null
        current = flag
    }
    return ne
}
```
