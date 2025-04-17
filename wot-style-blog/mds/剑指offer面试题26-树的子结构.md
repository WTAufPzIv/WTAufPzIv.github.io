---
date: 2020-03-15
categories: [技术,计算机通识,数据结构与算法]
thumbnail: /images/fe/offer.jpg
toc: true
---

# 剑指offer面试题26：树的子结构
<!--more-->
题目：输入两棵二叉树A和B，判断B是不是A的子结构。二叉树定义如下
 

```javascript
function TreeNode(x){
  	this.val = x
    this.left = null
    this.right = null
}
```
![](/images/assets/20200228180056246.png)

思路：　
这道题目使用递归的思想。上面这两棵树输入之后返回的是true，那么就以这个例子作为分析。

如果要知道B是不是A的左子树，无非就是在A中找到一个节点C，这个节点值和B根节点值相同，**并且B根节点的左子树是C节点的左子树的子结构，并且B根节点的右子树是C节点的右子树的子结构**
上面加粗部分描述很明显看出来又是一个俄罗斯套娃（滑稽），那么当然就用递归。
而递归终点的设置，依然还是找到问题最简单的时候：当然就是**当输入的B是一个单一的节点**，没有左子树和右子树。
例如上题的：
![](/images/assets/20200228180817791.png)
![](/images/assets/20200228180828668.png)

这个时候只需要对比一下两棵树的根节点就OK了。


代码如下

```javascript
function HasSubtree(a, b){
        if(a === null || b === null) return false
        let currentA = a
        let currentB = b
        //设置递归终点
        if(currentB.left === null && currentB.right === null){
            if(currentB.val === currentA.val) return true
            return false
        }
        else{
        	//如果根节点相同
            if(currentA.val === currentB.val){
            	//分别比较左右子树
                if(currentB.left && currentB.right){
                	//这里需要考虑三种情况，B有左右子树、B只有左子树、B只有右子树
                	//这里这样设置是为了防止与if(a === null || b === null) return false语句冲突
                    if(HasSubtree(currentA.left, currentB.left) && HasSubtree(currentA.right, currentB.right)){
                        return true
                    }
                }
                else{
                    if(currentB.left) return  HasSubtree(currentA.left, currentB.left)
                    else if(currentB.right) return HasSubtree(currentA.right, currentB.right)
                }
            }
            //如果根节点不相同，则继续遍历A的左右子树进行寻找
            return HasSubtree(currentA.left, currentB) || HasSubtree(currentA.right, currentB)
        }
    }
}
```
