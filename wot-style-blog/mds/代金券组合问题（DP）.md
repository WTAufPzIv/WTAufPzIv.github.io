---
date: 2020-03-19
categories: [技术,计算机通识,数据结构与算法]
thumbnail: /images/fe/offer.jpg
toc: true
---

# 代金券组合
<!--more-->
假设现有100元的商品，而代金券有50元、30元、20元、5元四种，则最佳优惠是两张50元面额的代金券；而如果现有65元的商品，则最佳优惠是两张30元代金券以及一张5元代金券。
给定目标金额和代金券种类，假设每类代金券数量无限多，求可以满足目标金额所需的最少代金券数量。如果没有任何组合可以满足，则输出Impossible


思路：这道题也是一个动态规划题。但是我那道题之后第一想法并没有想到动态规划，而是使用的递归查找，导致有大量的重复计算。效率不高，于是在线提交时直接tle了。
递归查找的思路很简单，就是设置一个栈保存当前递归的路径，然后每一次递归都分别把所有代金券压入栈去试，如果压入栈后找到了符合的那么就保存当前栈内的路径。如果压入栈后不满足，那么就递归查找。

代码如下：

```javascript
//money目标金额
//arr代金券数组
//stack当前遍历路径
//res结果数组，最终要在里面选最小的
//current
let min = Number.MAX_VALUE
function getmax(money, arr, stack, res, current){
    let currentnum = current + (stack.length === 0 ? 0 : stack[stack.length - 1])
    if(currentnum < money){
        for(let i = arr.indexOf(stack[stack.length - 1]); i < arr.length; i++){
            stack.push(arr[i])
            getmax(money, arr, stack, res, currentnum)
            stack.pop()
        }
    }
    else if(currentnum ===  money){
        min = Math.min(min, stack.length)
    }
    return min === Number.MAX_VALUE ? 'Impossible' : min
}
```

对于求极值问题，主要考虑动态规划来做，好处是保留了一些中间状态的计算值，可以避免大量的重复计算。我们维护一个一维动态数组 dp，其中 dp[i] 表示目标金额为i时的最小代金券数。那么我们就可以首先将dp所有元素初始化为最大值，然后对于dp[i]，分别使用所有代金券来更新他的最小值，更新的状态转移方程就是用

```javascript
dp[i] = min(dp[i], dp[i - coins[j]] + 1);
```
举个直观一点的例子来看就是，目标金额为100，当我只有5元代金券，```dp[100]```当然就是20
当我又有20元代金券，那么我可以选择用或者不用，不用的话```dp[100]```依然是20，用了的话```dp[100]```就变成的```dp[80] + 1```,
同理，当30元和50元的代金券到来时用同样的方法计算

代码如下：

```javascript
function getmax(money, arr){
    let dp = new Array(money + 1).fill(Number.MAX_VALUE - 10)
    dp[0] = 0
    for(let i = 1; i <= money; i++){
        for(let j of arr){
            if( i >= j ){
                dp[i] = Math.min(dp[i],dp[i-j]+1)
            }
        }
    }
    return dp[money] === Number.MAX_VALUE - 10 ? 'Impossible' : dp[money]
}
```
