---
date: 2020-03-15
categories: [技术,计算机通识,数据结构与算法]
thumbnail: /images/fe/offer.jpg
toc: true
---

# 剑指offer面试题8：二叉树的下一个节点
<!--more-->
题目：给定一颗二叉树和其中一个节点，如何找出中序遍历序列的下一个节点。注意，树中的结点不仅包含左右子结点，同时包含指向父结点的指针。

思路：　
		如果一个结点有右子树，那么它的下一个结点就是它的右子树中的左子结点。也就是说右子结点出发一直沿着指向左子结点的指针，我们就能找到它的下一个结点。 
　　接着我们分析一个结点没有右子树的情形。如果结点是它父节点的左子结点，那么它的下一个结点就是它的父结点。 
　　如果一个结点既没有右子树，并且它还是它父结点的右子结点，这种情形就比较复杂。我们可以沿着指向父节点的指针一直向上遍历，直到找到一个是它父结点的左子结点的结点。如果这样的结点存在，那么这个结点的父结点就是我们要找的下一个结点。

代码如下

```javascript
function GetNext(a){
   if(a === null) return null
    let target = null
    if(a.right){
        target = a.right
        while(target.left){
            target = target.left
        }
    }
    else if(a.parent){
        let cur = a
        target = a.parent
        while(target && target.left != cur ){
            cur = target
            target = target.parent
        }
    }
    return target
}
```
