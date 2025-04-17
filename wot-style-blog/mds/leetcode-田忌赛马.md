---
date: 2020-04-09
categories: [技术,计算机通识,数据结构与算法]
thumbnail: /images/fe/leetcode.jpg
toc: true
---

# 田忌赛马（难度：中等）
给定两个大小相等的数组 A 和 B，A 相对于 B 的优势可以用满足 A[i] > B[i] 的索引 i 的数目来描述。

返回 A 的任意排列，使其相对于 B 的优势最大化。

示例 1：

>输入：A = [2,7,11,15], B = [1,10,4,11]
输出：[2,11,7,15]


示例 2：

>输入：A = [12,24,8,32], B = [13,25,32,11]
输出：[24,32,8,12]

这道题是一个很经典的贪心算法题，其核心思想也很简单：

<!--more-->

**A当前最小值如果比B的当前最小值要大，就让这两个最小值配对。否则A当前最小值和B当前最大值配对，作用是以最小的代价消耗B中的大的部分。让每一个A中的值都发挥最大效用**

代码如下：

```javascript
var advantageCount = function(A, B) {
    let a = JSON.parse(JSON.stringify(A)),
    b = JSON.parse(JSON.stringify(B))
    a = a.sort(function(pre, next){
        if(pre > next){
            return 1
        }
        else{
            return -1
        }
    })
    b = b.sort(function(pre, next){
        if(pre > next){
            return 1
        }
        else{
            return -1
        }
    })
    let res = []
    while(b.length > 0){
        if(a[0] > b[0]){
            let flag = B.lastIndexOf(b[0])
            res[flag] = a[0]
            B[flag] = NaN
            a.shift()
            b.shift()
        }
        else{
            let flag = B.lastIndexOf(b[b.length - 1])
            res[flag] = a[0]
            B[flag] = NaN
            a.shift()
            b.pop()
        }
    }
    return res
};
```

