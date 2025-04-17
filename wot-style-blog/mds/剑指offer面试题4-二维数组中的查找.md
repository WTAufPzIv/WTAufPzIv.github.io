---
date: 2020-03-15
categories: [技术,计算机通识,数据结构与算法]
thumbnail: /images/fe/offer.jpg
toc: true
---

# 剑指offer面试题4：二维数组中的查找
<!--more-->

在一个二维数组中，每一行都按照从左到右递增的顺序排序，每一列都按照从上到下递增的顺序排序。请完成一个函数，输入这样的一个二维数组和一个整数，判断数组中是否含有该整数。
代码如下：

```javascript
function Find(target, array)
{
    // write code here
    var len = array[0].length - 1
    var he = 0
    var flag = 0
    while(len >= 0 && he <= array.length - 1){
        if(array[he][len] > target){
            len --
        }
        else if(array[he][len] < target){
            he ++
        }
        else{
            return true
        }
    }
    return false
}
```
