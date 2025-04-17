---
date: 2020-03-15
categories: [技术,计算机通识,数据结构与算法]
thumbnail: /images/fe/offer.jpg
toc: true
---

# 剑指offer面试题45：把数组组成最小的数
<!--more-->
输入一个正整数数组，把数组里所有数字拼接起来排成一个数，打印能拼接出的所有数字中最小的一个。例如输入数组{3，32，321}，则打印出这三个数字能排成的最小数字为321323。

这道题直观的解法就是，对于给定的两个串a和b，要想知道他们两个怎么排最小，直接比较ab和ba就可以了。
这道题主要的考点其实是在于大数的处理，题目输入的数字不一定是大数，但是几个数字拼接起来就免不了成为大数，所以需要用字符串来解决问题。


代码如下：

```javascript
function PrintMinNumber(numbers) {
    const sortNumber = numbers.sort((a, b) => {
        const str1 = a + '' + b;
        const str2 = b + '' + a;
        return Number(str1) > Number(str2);
    });
    return sortNumber.join('');
}
```
