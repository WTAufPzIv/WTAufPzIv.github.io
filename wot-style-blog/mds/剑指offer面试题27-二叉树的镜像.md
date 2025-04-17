---
date: 2020-03-15
categories: [技术,计算机通识,数据结构与算法]
thumbnail: /images/fe/offer.jpg
toc: true
---

# 剑指offer面试题27：二叉树的镜像
<!--more-->
题目：输入一棵二叉树，使用函数进行镜像翻转
```javascript
function TreeNode(x){
  	this.val = x
    this.left = null
    this.right = null
}
```
![](/images/assets/20200228180056246.png)

思路：　
		这道题本质上还是二叉树的遍历问题，其实就是在遍历过程中看看当前遍历到的这个节点是不是叶子节点，如果不是，那么就交换这个节点的左右子树，否则不做任何操作。
根据这个思路，这道题用递归就可以很简单地解决，根据分析，递归终点的设置，就是传入的节点是一个叶子节点。


代码如下

```javascript
function mirror(a){
        if(a === null) return null
        if(a.left === null && a.right === null){
            return null
        }
        let flag = a.left
        a.left = a.right
        a.right = flag
        if(a.left){
            mirror(a.left)
        }
        if(a.right){
            mirror(a.right)
        }
    }
```
