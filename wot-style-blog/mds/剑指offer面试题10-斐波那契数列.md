---
date: 2020-03-15
categories: [技术,计算机通识,数据结构与算法]
thumbnail: /images/fe/offer.jpg
toc: true
---

# 剑指offer面试题10：斐波那契数列
<!--more-->
![](/images/assets/20200312161522465.png)
这道题作为大多数教科书上面讲解递归的经典场景，并不意味着递归是这道题的最优解法，这道题用递归很容易写出这个代码

代码如下：

```javascript
function Fibonacci(n)
{
    // write code here
    if(n <= 0) return 0
    if(n === 1) return 1
    else{
        return Fibonacci(n - 1) + Fibonacci(n - 2)
    }
}
```
然后提交：
不出所料，TLE了
![](/images/assets/20200312162416468.png)
我们仔细想一下，随便举个例子，求f(10)，我们需要经过这些步骤：
![](/images/assets/20200312163247821.png)
很容易看出问题，在这棵树中有很多节点是重复的，而且重复节点数会随着n的增大而急剧增大，事实上，用递归方法计算这道题，时间复杂度会呈指数型增长

所以这道题最好的解法，就是老老实实顺着解:

```javascript
function Fibonacci(n)
{
    // write code here
    let a = []
    a[0] = 0
    a[1] = 1
    let k = 2
    while(k <= n){
        a[k] = a[k - 1] + a[k - 2]
        k++
    }
    return a[n]
}
```
这种做法只需要顺序遍历一边就可以解出答案，时间复杂度为：O(n)

当然，还有一种直接是O(1)的方法：通项公式。这个方法了解就好，一般不会有记住通项公式的要求
![](/images/assets/20200312164443972.png)


