---
date: 2020-03-15
categories: [技术,计算机通识,数据结构与算法]
thumbnail: /images/fe/offer.jpg
toc: true
---

# 剑指offer面试题40：最小的k个数
<!--more-->
输入n个整数，找出其中最小的K个数。例如输入4,5,1,6,2,7,3,8这8个数字，则最小的4个数字是1,2,3,4,。

和上一题做法一样，使用哈希表，控制时间复杂度到O(n)，然后从小到大遍历哈希表知道遍历的次数到达k，那么所得遍历结果就是最小的k个数

代码如下：

```javascript
function GetLeastNumbers_Solution(input, k)
{
    // write code here
    let arr = []
    let res  =[]
    for(let i = 0; i < input.length; i++){
        arr[input[i]] = 1
    }
    let i = 0
    while(k > 0){
        if(arr[i] !== undefined) {
            res.push(i)
            k--
        }
        i++
    }
    return res
}
```
