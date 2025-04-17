---
date: 2020-03-15
categories: [技术,计算机通识,数据结构与算法]
thumbnail: /images/fe/offer.jpg
toc: true
---

# 剑指offer面试题7：重建二叉树
<!--more-->
题目：输入某个二叉树的前序和中序遍历结果，重建该二叉树，例如输入前序遍历：12473568，中序遍历：47215386，则重建二叉树如下
![](/images/assets/20200226173822311.png)
这道题目使用递归的话思路就非常简单，函数接收两个长度一样的遍历结果，根据前序遍历第一个节点在中序遍历当中的位置，就可以判断出左子树和右子树分别有哪些节点，然后再分别把左子树和右子树当做另一个新的二叉树进行相同的方法递归，当传入的前序遍历和中序遍历都只有一个节点时说明到达递归终点，此时返回根节点即可

代码如下：

```javascript
function TreeNode(x) {
        this.val = x;
        this.left = null;
        this.right = null;
    }
    function reConstructBinaryTree(pre, vin){
    	let root //定义根节点
        if(pre.length === 1){
            root = {
                val : pre,
                left : null,
                right : null
            }
        }
        else{
        	let index = vin.indexOf(pre[0])
            if(index === 0){
                root = {
                    val : pre[0],
                    left : null,
                    right : reConstructBinaryTree(pre.slice(index + 1) ,vin.slice(index + 1))
                }
            }
            else if(index === vin.length - 1){
                root = {
                    val : pre[0],
                    left : reConstructBinaryTree(pre.slice(1, index + 1) ,vin.slice(0, index)),
                    right : null
                }
            }
            else{
                root = {
                    val : pre[0],
                    left : reConstructBinaryTree(pre.slice(1, index + 1) ,vin.slice(0, index)),
                    right : reConstructBinaryTree(pre.slice(index + 1) ,vin.slice(index + 1))
                }
            }
        	
        }
        return root
    }
```
