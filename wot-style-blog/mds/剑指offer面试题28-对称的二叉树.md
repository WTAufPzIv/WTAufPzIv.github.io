---
date: 2020-03-15
categories: [技术,计算机通识,数据结构与算法]
thumbnail: /images/fe/offer.jpg
toc: true
---

# 剑指offer面试题28：对称的二叉树
<!--more-->
请实现一个函数，用来判断一颗二叉树是不是对称的。注意，如果一个二叉树同此二叉树的镜像是同样的，定义其为对称的
```javascript
function TreeNode(x){
  	this.val = x
    this.left = null
    this.right = null
}
```


思路：　
		这道题本质上还是二叉树的遍历问题。题目已经给出如果一个二叉树同此二叉树的镜像是同样的，定义其为对称的。
		我们知道，二叉树的遍历有三种算法：前序遍历，中序遍历，后序遍历。三种遍历的共同点都是：先遍历左子树，再遍历右子树。但是稍微思考就会发现，如果对于一个二叉树的镜像进行前序遍历，那么对于原二叉树来说就变成了先遍历右子树再遍历左子树。因此，我们定义一种算法，叫做对称前序遍历，规则就是：先访问根节点，再遍右子树，最后遍历左子树。
		这样，当一棵数的前序遍历和对称前序遍历相同时，就是对称的二叉树

but wait.....

事情还没那么简单

![](/images/assets/2020030119195914.png)
对于这个二叉树，前序遍历和对称前序遍历结果一样，但是并不对称。
解决办法就是给所有叶子节点添加“null”标识。

代码如下

```javascript
function pre(a, arr){
    if(a === null) arr.push('null')
    else{
        arr.push(a.val)
        pre(a.left, arr)
        pre(a.right, arr)
    }
}
function preSym(a, arr){
    if(a === null) arr.push('null')
    else{
        arr.push(a.val)
        preSym(a.right, arr)
        preSym(a.left, arr)
    }
}
function isSymmetrical(tree){
    let arr1 = []
    let arr2 = []
    pre(tree, arr1)
    preSym(tree, arr2)
    // console.log(arr1, arr2)
    console.log(arr1.toString())
    console.log(arr2.toString())
    console.log(arr1.toString() === arr2.toString())
}
```
