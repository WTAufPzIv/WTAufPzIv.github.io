---
date: 2020-03-15
categories: [技术,计算机通识,数据结构与算法]
thumbnail: /images/fe/offer.jpg
toc: true
---

# 剑指offer面试题11：旋转数组的最小值
<!--more-->

题目： 把一个数组最开始的若干个元素搬到数组的末尾， 我们称之数组的旋转。输入一个递增排序的数组的一个旋转， 输出旋转数组的最小元素。例如数组{3，4, 5, 1, 2 ｝为｛ l1,2,3, 4，5}的一个旋转，该数组的最小值为1

通过分析这个旋转数组的特性我们可以发现，旋转后的数组实际上可以分为两组子数组，前者的所有元素均大于后者的所有元素。我们还可以注意到，我们要求的最小元素刚好就是这两组子数组的分界线。
所以这道题就是求这两个子数组之间的分界线。排序数组我们就可以用二分法的思想进行搜索，时间复杂度可以降为O(logn)

具体的步骤和二分法查找大体相同，用两个指针分别指向数组的第一个元素和最后一个元素，然后查看两个指针正中间的元素，如果正中间这个元素大于第一个指针的元素，那么就将第一个指针移到中间；否则如果正中间元素小于最后一个指针的元素，则将最后一个指针移到正中间，以此往复循环，直到两个指针相邻，那么第二个指针就是最小的元素。

这道题需要考虑两个特殊情况，一个是这个旋转数组就是原数组：[1,2,3,4,5]，这个时候用上述方法就会发现中间的元素既大于指针1元素又小于指针2元素，所以出现了bug，这种情况直接返回数组第一项就行。第二种情况是两个指针指向的元素大小相同，这个时候中间的元素要么同时大于两个指针元素，要么同时小于两个指针元素，也出现了bug，这种情况只能按顺序来搜索，时间复杂度也免不了成为O(n)，

代码如下：

```javascript
function minNumberInRotateArray(p){
    // write code here
    if(p.length === 0) return 0
    if(p[0] < p[p.length - 1]) return p[0]
    else if(p[0] === p[p.length - 1]){
        let min = Number.MAX_VALUE
        for(let i = 0; i < p.length; i++){
            if(p[i] < min) min = p[i]
        }
        return min
    }
    else{
        let index1 = 0
        let index2 = p.length - 1
        let indexMid
        while(p[index1] >= p[index2]){
            if(index2 - index1 === 1) return p[index2]
            indexMid = Math.round(((index1 + index2) / 2))
            if(p[indexMid] >= p[index1]){
                index1 = indexMid
            }
            else if(p[index2] >= p[indexMid]){
                index2 = indexMid
            }
        }
    }
}
```


