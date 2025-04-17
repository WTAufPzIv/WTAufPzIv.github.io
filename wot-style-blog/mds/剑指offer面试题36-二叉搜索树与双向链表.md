---
date: 2020-03-15
categories: [技术,计算机通识,数据结构与算法]
thumbnail: /images/fe/offer.jpg
toc: true
---

# 剑指offer面试题36：二叉搜索树与双向链表
<!--more-->
题目：输入一棵二叉搜索树，将该二叉搜索树转换成为排序的双向链表，要求不能创建任何新的节点，只能调整二叉树当中指针的指向

![](/images/assets/20200309200354571.png)

思路：这道题也是使用的递归的思想，和大多数二叉树的题一样，我们把上面这棵树分成三个部分，根节点10、左子树、右子树。那么以根节点出发，根据二叉搜索树的性质我们可以很简单地推断出，**10的左节点就是左子树的最大值，10的右节点就是右子树的最小值**。那么递归的规律我们就找到了，先找出左子树的最大值节点，和根节点10进行连接；再找出右子树的最大值节点，和根节点10连接。

接下来找到递归终点：当一个节点是叶子节点，那么直接返回这个节点即可

需要注意的是：10的左边连接的是左子树最大值，右边连接的是右子树的最大值。所以我们的函数不仅需要操作指针，还需要返回当前树的最值节点。（最左边或者最右边）

代码如下：

```javascript
function ConvertNode(a, num){
        if(a === null) return null
        if(a.left === null && a.right === null){
            return a
        }
        else{
            if(a.left){
                let flag = ConvertNode(a.left, 0)
                a.left = flag
                flag.right = a
            }
            if(a.right){
                let flag1 = ConvertNode(a.right, 1)
                a.right = flag1
                flag1.left = a
            }
            if(num === 0){
                return (a.right === null ?  a : a.right)//这个地方其实写的有问题，需要返回当前根节点的最右节点，而不是右节点
            }
            else if(num === 1){
                return (a.left === null ?   a : a.left)//这个地方也一样
                //但是这个代码却在牛客上面过了.......
            }
        }
    }
    function Convert(a){
        if(a === null) return null
        let p = ConvertNode(a,1)
        while(p && p.left){
            p = p.left
        }
        return p
    }
```
