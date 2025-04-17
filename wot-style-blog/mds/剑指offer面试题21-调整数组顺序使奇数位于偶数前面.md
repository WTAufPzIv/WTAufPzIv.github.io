---
date: 2020-03-15
categories: [技术,计算机通识,数据结构与算法]
thumbnail: /images/fe/offer.jpg
toc: true
---

# 剑指offer面试题21：调整数组顺序使奇数位于偶数前面
<!--more-->
输入一个整数数组，实现一个函数来调整该数组中数字的顺序，使得所有的奇数位于数组的前半部分，所有的偶数位于数组的后半部分，并保证奇数和奇数，偶数和偶数之间的相对位置不变。.

对于题目最后一句话，要求相对位置不变，我们先考虑不用满足这个情况，有一个时间复杂度为O（n）的解法，整个过称维护两个指针，一个指向头每一个指向尾。

对于头指针，如果当前指向的元素是奇数，那么就往后移动，对于尾指针，如果指向的是偶数，那么向前移动。如果头指针指向了偶数，那么直接将两个指针的元素交换。以此循环，直到两个指针相遇。

代码如下：

```javascript
 function reOrderArray(a){
    if(a === null || a.length === 0) return []
    let start = 0
    let end = a.length - 1
    while(start < end){
        if(a[start] % 2 === 1){
            start ++
        }
        if(a[end] % 2 === 0){
            end -- 
        }
        if(a[start] % 2 === 0 && (start < end)){
            let flag = a[start]
            a[start] = a[end]
            a[end] = flag
            continue
        }
    }
    return a
}
```
如果要满足题目中相对位置不变，那么就可以考虑从数组尾部开始遍历，将所有奇数依次加到数组的头部，并同时删除这个元素，直到遍历到原数组头部为止，这样数组就自动成为了奇数在前偶数在后，而且相对位置不变

```javascript
function reOrderArray1(a){
   if(a === null || a.length === 0) return []
    a.unshift('x')
    let i = a.length - 1
    while(a[i] !== 'x'){
        if(a[i] % 2 === 1){
            a.unshift(a[i])
            i++
            a.splice(i, 1)

        }
        else{
            i--

        }
    }
    let s = a.indexOf('x')
    a.splice(s, 1)
    return a
}
```
