---
date: 2020-04-09
categories: [技术,计算机通识,数据结构与算法]
thumbnail: /images/fe/leetcode.jpg
toc: true
---

# 括号生成(难度：中等)
数字 n 代表生成括号的对数，请你设计一个函数，用于能够生成所有可能的并且 有效的 括号组合。
>输入：n = 3
输出：[
       "((()))",
       "(()())",
       "(())()",
       "()(())",
       "()()()"
     ]

这道题的比较好的解法就是深搜+回溯的算法。我们设置一个path用于保存路径，那么递归的终点就显而易见了：当path的长度为n的两倍，那么这个时候就代表已经找出了一条符合要求的解，直接保存下来就可以了。

当path长度小于n的两倍，说明还可以往里面放括号，这个时候有两种情况，左括号的数量小于n，说明这个时候还可以继续放左括号。第二种情况，右括号的数量小于左括号的数量，说明这个时候可以放右括号。需要注意的是，这两种情况不是互斥的，而是需要顺序执行

那么我们就可以对放左括号和右括号进行递归，为了实现回溯，我们每一次递归完，都需要回退当前情况下的path和左右括号的放置情况

<!--more-->

代码如下：

```javascript
var generateParenthesis = function(n) {
    let res = [],
    arr = new Array(n)

    for(let i = 0; i < n; i++){
        arr[i] = '('
    }
    dfs(n, res, [], [], [])
    return res.map(v => {
        return v.join('')
    })
};
function dfs(n, res, path, left, right){
    if(path.length === n * 2){
        res.push(JSON.parse(JSON.stringify(path)))
        return 0
    }
    if(left.length < n){
        path.push('(')
        left.push('(')
        dfs(n, res, path, left, right)
        path.pop()
        left.pop()
    }
    if(right.length < left.length){
        path.push(')')
        right.push(')')
        dfs(n, res, path, left, right)
        path.pop()
        right.pop()
    }
    
}
```
