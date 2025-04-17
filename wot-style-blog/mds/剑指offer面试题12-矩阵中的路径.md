---
date: 2020-03-15
categories: [技术,计算机通识,数据结构与算法]
thumbnail: /images/fe/offer.jpg
toc: true
---

# 剑指offer面试题12：矩阵中的路径
<!--more-->
请设计一个函数，用来判断在一个矩阵中是否存在一条包含某字符串所有字符的路径。路径可以从矩阵中的任意一个格子开始，每一步可以在矩阵中向左，向右，向上，向下移动一个格子。如果一条路径经过了矩阵中的某一个格子，则该路径不能再进入该格子。 例如 
![](/images/assets/2020031311141630.png)
   矩阵中包含一条字符串"bcced"的路径，但是矩阵中不包含"abcb"路径，因为字符串的第一个字符b占据了矩阵中的第一行第二个格子之后，路径不能再次进入该格子。

思路：这道题使用的是回溯法解决问题。由于题目没有要求从哪个点作为起点，所以所有的点都要试一下，直到找到路径的起点值。

这道题的回溯思想就是，当遍历到一个点，就分别搜索这个点的上下左右点是否可以满足条件，如果满足条件，那么就把这个点标记为“已路过”，并继续搜索；否则释放标记。

回溯可以说天生就是和递归相配合的，对于这道题，依然适用递归的方法；我们还是来寻找递归终点。
这道题的递归终点就在，遍历到的这个点在路径上的位置，不仅恰好等于字符串的这个位置的值，并且这个位置是字符串的最后一个位置，那么这个时候就说明找到了路径，返回true

其他时候，对于遍历到的点，首先判断边界条件，例如这个点是否被访问过、是否超出了原数组的边界，或者路径长度直接大于了原数组长度。这些情况一律返回false

然后比较当前遍历到的这个点的值，记录他的位置index，然后在字符串中查看index这个位置的字符和这个点的值是不是相等，如果不相等也是直接返回false，并且将visit数组中对应的值释放（能够正常回溯）

如果这个值相等，那么就是两种情况，要么到达遍历终点，要么继续搜索。

代码如下：

```javascript
function hasPath(matrix, rows, cols, path){
   // write code here
    let a = false
    if(matrix === null || rows < 1 || cols < 1 || !path) return false
    let visit = new Array(rows)
    for(let i = 0; i < rows; i++){
        visit[i] = new Array(cols)
    }
    let pathlength = 0
    for(let i = 0; i < rows; i++){
        for(let j = 0; j < cols; j++){
            a = a || findhasPath(matrix, i, j, rows, cols, visit, path, pathlength)
        }
    }
    return a
}
function findhasPath(matrix, i, j, rows, cols, visit, path, pathlength){
    let index = i * cols + j
    let has
    if(matrix[index] !== path[pathlength] || i < 0 || j < 0  || i > rows - 1 || j > cols - 1 || visit[i][j] === 1 || path.length > matrix.length) return false
    else{
        let pathLength = pathlength + 1
        visit[i][j] = 1
        if(pathLength === path.length) return true
        else{
            has = findhasPath(matrix, i, j + 1, rows, cols, visit, path, pathLength) || 
                  findhasPath(matrix, i + 1, j, rows, cols, visit, path, pathLength) || 
                  findhasPath(matrix, i - 1, j, rows, cols, visit, path, pathLength) ||
                  findhasPath(matrix, i, j - 1, rows, cols, visit, path, pathLength)
            if(has){
                return true
            }
            else{
                visit[i][j] = 0
                return false
            }
        }
    }
}
```
