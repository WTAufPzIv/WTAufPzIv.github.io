---
date: 2020-03-15
categories: [技术,计算机通识,数据结构与算法]
thumbnail: /images/fe/offer.jpg
toc: true
---

# 剑指offer面试题55：二叉树的深度
<!--more-->
题目：输入某个二叉树，求该树很节点到叶子节点最远路径的长度，该长度定义为二叉树的深度，例如下面这个二叉树，输出值为4
![](/images/assets/20200226173822311.png)
这个题目也是使用递归的思想，以上面这个树为例：要求以1为根节点的树的深度，其实就是分别求出其左子树和右子树的深度，取两者的最大值，加上a本身占用的深度值就可以了
递归终点的设置，自然就是当传入的节点是一个空指针，这个时候返回0就可以了


代码如下：

```javascript
 function treedeep(a){
     if(a === null) return 0
     return Math.max(treedeep(a.left), treedeep(a.right))  + 1
}
```
