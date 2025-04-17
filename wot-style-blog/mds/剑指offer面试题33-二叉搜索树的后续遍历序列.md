---
date: 2020-03-15
categories: [技术,计算机通识,数据结构与算法]
thumbnail: /images/fe/offer.jpg
toc: true
---

# 剑指offer面试题33：二叉搜索树的后序遍历序列
<!--more-->
题目：输入一个整数数组，判断该数组是不是某二叉搜索树的后续遍历结果。

结题思路：这道题我依然使用的是递归，根据后续遍历的特性我们知道，二叉树的后序遍历结果中最后一个值就是二叉树的根节点，然后剩下的被分为两个部分：左子树和右子树。所以对于输入的数组，也是把它分为三个部分：【左子树】【右子树】【根节点】，从数组最左边开始，将小于根节点的节点放入left中，剩下的放入right中。

注意可以看到这个步骤可以确保【左子树】中的值全部小于根节点，却不能保证右子树的值全部大于根结点。根据这个结论，右子树就成为判断的第一个条件：【右子树】中一旦有一个节点值小于根节点，直接返回false，否则进入下一步

接下来就是对左右子树进行递归，那么依然是要寻找递归终点。在什么情况下可以很简单的决断呢？

其实可以发现，任何三个以内的节点都可以组成一棵二叉搜索树，所以递归终点就是，当输入的a的长度len满足（len <= 3 && len >= 1）,那么直接返回true

代码如下：

```javascript
function VerifySquenceOfBST(a){
    let root = a[a.length - 1]
    let left = []
    let right = []
    let flag = 0
    for(let i = 0; i < a.length - 1; i++){
        flag ++
        if(a[i] < root){
            left.push(a[i])
        }
        else{
            break
        }
        
    }
    while(flag < a.length - 1){
        if(a[flag] > root){
            right.push(a[flag])
        }
        else{
            return false
        }
        flag ++
    }
    if(a === null || a.length === 0){
        return false
    }
    else if(a.length <= 3 && a.length >= 1){
        return true
    }
    else{
    //之所以这么递归，当初是考虑到12345这个情况，递归的右子树是个空数组，误触上面的第一个if
        return (VerifySquenceOfBST(left.length === 0 ? [1] : left) && VerifySquenceOfBST(right.length === 0 ? [1]: right))
    }
}
```
