---
date: 2020-03-15
categories: [技术,计算机通识,数据结构与算法]
thumbnail: /images/fe/offer.jpg
toc: true
---

# 剑指offer面试题39：数组中出现次数超过一半的数字
<!--more-->
数组中有一个数字出现的次数超过数组长度的一半，请找出这个数字。例如输入一个长度为9的数组{1,2,3,2,2,2,5,4,2}。由于数字2在数组中出现了5次，超过数组长度的一半，因此输出2。如果不存在则输出0。

代码如下：

```javascript
function MoreThanHalfNum_Solution(numbers){
    // write code here
    let arr = []
    for(let i = 0; i < numbers.length; i++){
        arr[numbers[i]] === undefined ? arr[numbers[i]] = 1 : arr[numbers[i]] += 1
    }
    for(let i = 0; i < arr.length; i++){
        if((arr[i] || 0) > ((numbers.length)/2)){
            return i
        }
    }
    return 0
}
```
