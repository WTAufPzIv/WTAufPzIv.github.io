---
date: 2020-04-07
categories: [技术,计算机通识,数据结构与算法]
thumbnail: /images/fe/leetcode.jpg
toc: true
---

# 平衡二叉树（难度：简单）
给定一个二叉树，判断它是否是高度平衡的二叉树。

本题中，一棵高度平衡二叉树定义为：<span style="color:rgb(221,80,68)">一个二叉树每个节点的左右两个子树的高度差的绝对值不超过1。</span>

这道题可以想到的最简单得方法是从根节点递归遍历二叉树，对于遍历到的节点依次对左右子树求二叉树的深度，然后对比两个深度之差，若超过1，则不是平衡二叉树。但这样做的问题依然是递归过程会产生大量的重复计算，时间复杂度是O(n * logn)。

因此这道题可以反过来想，从底向上遍历二叉树，这样就不会产生重复的计算。<span style="color:rgb(221,80,68)">我们使用后序遍历的思想</span>，先遍历当前根节点的左右子树，这样就可以求得当前根节点的深度以及直到当前根节点所在的子树是不是平衡二叉树，然后当前根节点遍历的结果又可以作为它的父亲节点计算的依据，实现一个从下往上的计算。
<!--more-->
代码如下：
```js
function isBalanced1(root, arr){
    
    if(root === null){
        arr[0] = 0
        return true
    }
    let par = [[0],[0]]
    if(isBalanced1(root.left, par[0]) && isBalanced1(root.right, par[1])){//先遍历左右子树
        if(Math.abs(par[0][0] - par[1][0]) <= 1){ //同时判断当前根节点组成的子树是不是平衡二叉树
            arr[0] = 1 + Math.max(par[0][0], par[1][0])//再更新当前根节点的深度
            return true
        }
    }
    return false
}
function isBalanced(root) {
    var arr = new Array(1)
    arr[0] = 0
    return isBalanced1(root, arr)
};
```