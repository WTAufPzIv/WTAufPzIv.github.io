---
date: 2020-03-15
categories: [技术,计算机通识,数据结构与算法]
thumbnail: /images/fe/offer.jpg
toc: true
---

# 剑指offer面试题37：序列化二叉树
<!--more-->
请实现两个函数，分别用来序列化和反序列化二叉树

二叉树的序列化是指：把一棵二叉树按照某种遍历方式的结果以某种格式保存为字符串，从而使得内存中建立起来的二叉树可以持久保存。序列化可以基于先序、中序、后序、层序的二叉树遍历方式来进行修改，序列化的结果是一个字符串，序列化时通过 某种符号表示空节点（#），以 ！ 表示一个结点值的结束（value!）。

二叉树的反序列化是指：根据某种遍历顺序得到的序列化字符串结果str，重构二叉树。

在序列化的过程当中，我们使用的是递归的前序遍历，从根节点开始，当遇到的节点不为空，那么就往数组中添加这个节点的值，否则往数组中添加一个特殊字符`'#'`

关于反序列化，既然我们用递归进行的序列化，那么依然可以使用递归进行反序列化。除此之外，也可以不使用递归，借助栈和循环的方式也可以实现反序列化

首先说一说递归，这道题的递归思路是：对于传入的一个串，也是分为根节点，左子树，右子树；那么就可以首先将第一个字符构建成为一个根节点，然后分别对左右子树进行递归构建（先构建左子树，再构建右子树,保证两者的顺序是关键）。递归终点就是，当传入的串第一个字符是#号，说明当前已经构建到了叶子节点，那么返回null，继续构建其他子树

代码如下（递归版本）

```javascript
function TreeNode(x) {
    this.val = x;
    this.left = null;
    this.right = null;
}
var arr = [];
function Serialize(pRoot)
{
    // write code here
    if(pRoot==null){
        arr.push('a');
    }else{
        arr.push(pRoot.val);
        Serialize(pRoot.left);
        Serialize(pRoot.right);
    }
        
}
function Deserialize(s)
{
    // write code here
    var node = null;
    if(arr.length<1){
        return null;
    }
    var number = arr.shift();
    if(typeof number == 'number'){
        node = new TreeNode(number);
        node.left = Deserialize(arr);
        node.right = Deserialize(arr);
    }
    return node;
}
```


然后就是非递归，我们需要用一个栈记录当前需要处理的节点，所以我们给每个节点增加了Left和Right，用来鉴别当前这个节点是不是已经给左子树和右子树都赋值（不管赋的是节点还是null），如果两者都已赋值则标为：已处理，否则记为未处理。
那么对于当前的循环，首先判断栈顶节点是否已经被处理，如果被处理，则弹出栈，否则**先后查看**该节点的左子树和右子树，给没有被处理的子树添加节点，如果添加的节点不为null，那么就将这个新节点继续入栈，如此往复

代码如下（非递归版本）

```javascript
function TreeNode(x){
    this.val = x
    this.left = null
    this.right = null
    this.Left = 0
    this.Right = 0
}
let po = []
function Serialize(pRoot)
{
    // write code here
    if(pRoot === null){
        po.push('#')
        return null
    }
    else{
        po.push(pRoot.val)
        Serialize(pRoot.left)
        Serialize(pRoot.right)
    }
}

function Deserialize(s)
{
    // write code here
    let stack = []
    let root = (po[0] === '#') ? null : new TreeNode(po[0])
    if(root !== null){
        stack.push(root)
    }
    po.shift()
    while(po.length > 0 && stack.length > 0){
        if(stack[stack.length - 1].Left === 0){
            let k = (po[0] === '#') ? null : new TreeNode(po[0])
            stack[stack.length - 1].left = k
            stack[stack.length - 1].Left = 1
            if(k !== null){
                stack.push(k)
            }
            po.shift()

        }
        else if(stack[stack.length - 1].Right === 0){
            let k = (po[0] === '#') ? null : new TreeNode(po[0])
            stack[stack.length - 1].right = k
            stack[stack.length - 1].Right = 1
            if(k !== null){
                stack.push(k)
            }
            po.shift()
        }
        else if(stack[stack.length - 1].Left !== 0 && stack[stack.length - 1].Light !== 0){
            stack.pop()
        }
    }
    return root
}
```



