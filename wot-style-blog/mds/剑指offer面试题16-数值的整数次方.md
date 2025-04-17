---
date: 2020-03-15
categories: [技术,计算机通识,数据结构与算法]
thumbnail: /images/fe/offer.jpg
toc: true
---

# 剑指offer面试题16：数值的整数次方
<!--more-->
给定一个double类型的浮点数base和int类型的整数exponent。求base的exponent次方。可以保证base和exponent不同时为0

思路：
这道题其实主要就是考察边界情况，需要考虑指数和底数各自分别为正数、0、负数的情况。这一点就不多做说明了，主要是说一下求幂本身，除了用循环进行累乘，这道题还可以有更高效的解法：利用递归。假设我们求一个数的32次方，那么其实就是两个16次方的结果相乘，求16次方，其实就是两个8次方相乘...以此类推。

那么既然要做到高效率。我们就把它做到极致，用位运算来代替除法和求余运算。因为位运算的运算效率要远高于除法和求余。

代码如下：

```javascript
function PowerUn(a, b){
   if(b === 0) return 1
    if(b === 1) return a
    let res = PowerUn(a, b >> 1)
    res *= res
    if(b & 0x1 === 1) res *= a
    return res
}
function Power(base, exponent)
{
    // write code here
    if(base === 0) return 0
    if(exponent < 0){
        return 1/(PowerUn(base, Math.abs(exponent)))
    }
    else{
        return PowerUn(base, exponent)
    }
}
```
