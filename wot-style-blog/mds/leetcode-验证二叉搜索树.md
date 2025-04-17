---
date: 2020-05-05
categories: [技术,计算机通识,数据结构与算法]
thumbnail: /images/fe/leetcode.jpg
toc: true
---

# 验证二叉搜索树（难度：中等）
给定一个二叉树，判断其是否是一个有效的二叉搜索树。

假设一个二叉搜索树具有如下特征：

- 节点的左子树只包含小于当前节点的数。
- 节点的右子树只包含大于当前节点的数。
- 所有左子树和右子树自身必须也是二叉搜索树。
![](/images/assets/20200505221528767.png)
这道题首先结合二叉树的普遍解题步骤可以立刻想到借用递归，从根节点开始向下遍历，过程中维护一个区间【a，b】，那么对于当前节点的左子树，要满足所有节点的值在【a，当前节点值】之间，当前节点的右子树，要满足所有节点的值在【当前节点值，b】之间。在遍历过程中不断更新这个区间即可

<!--more-->
代码如下：

```javascript
var isValidBST = function(root) {
    return isbst(root, -Number.MAX_VALUE, Number.MAX_VALUE)
};
function isbst(root, min, max){
    if(root === null) return true
    if(root.val <= min || root.val >= max){
        return false
    }
    else{
        return isbst(root.left, min, root.val) && isbst(root.right, root.val, max)
    }
}
```

除了这个方法之外，我们就需要结合二叉搜索树一个很重要的功能，或者说是性质：
<p style="font-size:20px;color:red;">二叉搜索树的中序遍历序列是严格递增的</p>

所以我们只需要判断一下这个二叉树的中序遍历序列是不是递增序列就可以了

```javascript
var isValidBST = function(root) {
    let arr = []
    if(root !== null){
        isbst(root, arr)
        for(let i = 1; i < arr.length; i++){
            if(arr[i] < arr[i - 1]){
                return false
            }
        }
        return true
    }
    else{
        return true
    }
};
function isbst(root, arr){
    if(root){
        isbst(root.left, arr)
        arr.push(root.val)
        isbst(root.right, arr)
    }
}
```
