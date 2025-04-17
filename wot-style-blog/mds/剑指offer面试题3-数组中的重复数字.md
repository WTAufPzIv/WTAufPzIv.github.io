---
date: 2020-03-15
categories: [技术,计算机通识,数据结构与算法]
thumbnail: /images/fe/offer.jpg
toc: true
---

# 剑指offer面试题3：数组中重复的数字
<!--more-->
在一个长度为n的数组里的所有数字都在0到n-1的范围内。数组中某些数字是重复的，但不知道有几个数字重复了，也不知道每个数字重复了几次。请找出数组中任意一个重复的数字。

思路：
这道题可以想到三种解法，首先第一种是最容易想到的：先将数组排序，从排序的数组中找到重复的数字是比较简单的一件事。最快的排序算法时间复杂度为O(nlogn)。这里就先不写这种方法了

第二种方法：时间复杂度O(n)，空间复杂度O(n)。利用哈希表来解决问题，从头到尾扫描数组，如果当前项在哈希表中，那么就说明找到一个重复的数字，否则就往哈希表中添加该元素

代码如下：

```javascript
function duplicate(numbers, duplication)
{
    // write code here
    //这里要特别注意~找到任意重复的一个值并赋值到duplication[0]
    //函数返回True/False
    let a = []
    for(let i = 0; i < numbers.length ; i++){
        if(a[numbers[i]] === 1){
            duplication[0] = numbers[i]
            return true
        }
        else{
            a[numbers[i]] = 1
        }
        
    } 
    return false
}
```
第三种方案：时间复杂度O(n)，空间复杂度O(1)。我们从数组下标0开始，对比下标k这个地方的值是不是等于k，如果是，那么转到下标k + 1，否则，将下标k的数字number[k]，和下标number[k]的数字进行比较，如果两者不相等，那么两者交换位置，否则说明找到一个重复元素

代码如下：

```javascript
function duplicate(numbers, duplication)
{
    // write code here
    //这里要特别注意~找到任意重复的一个值并赋值到duplication[0]
    //函数返回True/False
    let i = 0
    while(i < numbers.length){
        if(numbers[i] !== i){
            let flag =  numbers[numbers[i]]
            if(flag === numbers[i]){
                duplication[0] = numbers[i]
                return true
            }
            else{
                numbers[numbers[i]] = numbers[i]
                numbers[i] = flag
            } 
        }
        else{
            i++
        }
    }
} 
```
