
---
date: 2020-04-07
categories: [技术,计算机通识,数据结构与算法]
thumbnail: /images/fe/leetcode.jpg
toc: true
---

# 旋转矩阵（难度：中等）
给你一幅由 N × N 矩阵表示的图像，其中每个像素的大小为 4 字节。请你设计一种算法，将图像旋转 90 度。
不占用额外内存空间能否做到？

<!--more-->

题解：对于下面这个数组
![](/images/assets/20200407182726236.png)
先由对角线进行翻转：
![](/images/assets/20200407182819133.png)
然后再对每一行进行翻转，就得到了

![](/images/assets/20200407182917140.png)
代码如下：

```javascript
var rotate = function(matrix) {
    let len = matrix.length
    for(let i = 0; i < len; i++){
        for(let j = 0; j < i; j++){
            let flag = matrix[i][j]
            matrix[i][j] = matrix[j][i]
            matrix[j][i] = flag
        }
    }
    for(let i = 0; i < len; i++){
        matrix[i].reverse()
    }
    return matrix
}
```