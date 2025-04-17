---
date: 2020-03-15
categories: [技术,计算机通识,数据结构与算法]
thumbnail: /images/fe/offer.jpg
toc: true
---

# 剑指offer面试题13：矩阵中的路径
<!--more-->
地上有一个m行和n列的方格。一个机器人从坐标0,0的格子开始移动，每一次只能向左，右，上，下四个方向移动一格，但是不能进入行坐标和列坐标的数位之和大于k的格子。 例如，当k为18时，机器人能够进入方格（35,37），因为3+5+3+7 = 18。但是，它不能进入方格（35,38），因为3+5+3+8 = 19。请问该机器人能够达到多少个格子？

思路：
这道题使用的回溯思想，和上一个题基本类似

**当遍历到一个点，就分别搜索这个点的上下左右点是否可以满足条件，如果满足条件，那么就把这个点标记为“已路过”，并继续搜索；否则释放标记。**

对于遍历到的点，依然是首先判断条件，例如这个点是否被访问过、是否超出了原数组的边界，或者是否满足题目要求的不能进入行坐标和列坐标的数位之和大于k的格子。如果不满足这些情况一律返回0


否则就将这个点在visit中标记，然后在递归访问他的相邻节点

代码如下：

```javascript
function movingCount(threshold, rows, cols){
    // write code here
    let visit = new Array(rows)
    for(let i = 0; i < rows; i++){
        visit[i] = new Array(cols)
    }
    return calCount(threshold, rows, cols, visit, 0, 0)
}
function calCount(threshold, rows, cols, visit, i, j){
    let rowsS = i.toString()
    let colsS = j.toString()
    let num = 0
    for(let i = 0; i < rowsS.length; i++){
        num += parseInt(rowsS[i])
    }
    for(let i = 0; i < colsS.length; i++){
        num += parseInt(colsS[i])
    }
    if(num > threshold || i < 0 || j < 0 || i >= rows || j >= cols || visit[i][j] === 1 ) return 0
    else{  
        visit[i][j] = 1
        let count = 1 + calCount(threshold, rows, cols, visit, i, j + 1) +
                   calCount(threshold, rows, cols, visit, i + 1, j) +
                   calCount(threshold, rows, cols, visit, i - 1, j) +
                   calCount(threshold, rows, cols, visit, i, j - 1) 
        return count
    }
}
```
