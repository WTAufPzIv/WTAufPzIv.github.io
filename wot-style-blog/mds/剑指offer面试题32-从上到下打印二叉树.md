---
date: 2020-03-15
categories: [技术,计算机通识,数据结构与算法]
thumbnail: /images/fe/offer.jpg
toc: true
---

# 剑指offer面试题32：从上到下打印二叉树
<!--more-->
题目：输入某个二叉树，依次打印出二叉树每个节点，同一层的节点按照从左到右的顺序打印出来。例如这个二叉树，打印：12345678
![](/images/assets/20200226173822311.png)
这个题目的遍历方法和传统的二叉树遍历不一样，无法使用递归。
首先在打印1的时候我们需要**顺序保存**2和3，打印2时候我们需要保存4，打印3时候我们需要**顺序保存**5和6...以此类推

为了实现顺序这一目的吗，我们使用队列，每次从队头取出值打印，并将其左右子节点（如果有）压如队列中：
一开始1入队，对列为【1】
队头为1，打印1的时候，队列为【2,3】
队头为2，打印2的时候，对列为【3,4】
队头为3，打印3的时候，对列为【4,5,6】
。。。以此类推，直到队列为空


代码如下：

```javascript
function print(a){
    let queue = []
    let data = []
    if(a !== null){
        queue.push(a)
    }
    
    while(queue.length !== 0){
        let flag = queue.shift()
        data.push(flag.val)
        if(flag.left !== null){
            queue.push(flag.left)
        }
        if(flag.right !== null){
            queue.push(flag.right)
        }
    }
    return data
}
```
