---
date: 2020-03-15
categories: [技术,计算机通识,数据结构与算法]
thumbnail: /images/fe/offer.jpg
toc: true
---

# 剑指offer面试题34：二叉树中和为某一值的路径
<!--more-->
题目：输入一个二叉树和一个整数，打印出二叉树中节点值的和为输入的整数的所有路径

结题思路：这道题依然使用的是递归，并且与前序遍历相结合使用

这道题其实和之前按行打印二叉树是一样的，需要一个栈来实现一边遍历一边记录的过程。

使用一个path来记录这道题的答案，也就是符合条件的路径，根据这个描述，可知最终path是一个二维数组；使用stack来记录当前已经走过的路径；使用current记录：截止到当前路径，路径上所有节点值的和。

对于访问到的当前节点：首先将这个节点push到stack中去，以记录路径。然后将current加上当前这个节点的值，然后再进行下面的操作

首先找出递归终点：和前序遍历的递归终点一样，如果访问的是一个叶子节点，那么就是当前的递归终点，这时候进行判断：截止到这个叶子节点，现在走过的路径上的节点和等于count（题目要求的值），那么就保存这个时候stack里的内容，就是把它直接保存到path当中（注意：这里保存的时候不能直接把stack给push到path中去，因为stack最终会是一个空数组，而push的时候保存的是stack的引用。所以需要进行一下深复制）；然后用同样的方法进行

否则继续递归，当这一步操作完成后，也就完成了对当前节点的访问，所以要把当前节点从stack中弹出来，直接使用poo就可以了



代码如下：

```javascript
function FindPath(a, b){
    let path= []
    let stack = []
    resolveProblem(a, b, path, stack , 0)
    return path
}
function resolveProblem(root, count, path, stack, current){
    stack.push(root.val)
    current += root.val
    if(current === count && root.left === null && root.right === null){
        let o = JSON.parse(JSON.stringify(stack))
        path.push(o)
    }
    else{
        if(root.left){
            resolveProblem(root.left, count, path, stack, current)
        }
        if(root.right){
            resolveProblem(root.right, count, path, stack, current)
        }
    }
    stack.pop()
}
```
