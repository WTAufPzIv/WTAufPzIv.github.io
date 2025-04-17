---
date: 2020-03-15
categories: [技术,计算机通识,数据结构与算法]
thumbnail: /images/fe/offer.jpg
toc: true
---

# 剑指offer面试题14：剪绳子
<!--more-->
给你一根长度为n的绳子，请把绳子剪成整数长的m段（m、n都是整数，n>1并且m>1），每段绳子的长度记为k[0],k[1],...,k[m]。请问k[0]xk[1]x...xk[m]可能的最大乘积是多少？例如，当绳子的长度是8时，我们把它剪成长度分别为2、3、3的三段，此时得到的最大乘积是18。


思路：
这道题可以使用动态规划和贪心算法，前者时间复杂度和空间复杂度是O(n^2),O(n)而后者均是O(1)

先来说一说动态规划，动态规划的概念就是将一个大问题分解为若干子问题来解决，对于这道题，也是可以用这种思想。

对于长度为n的绳子，我们可以把它剪成i和n-i的两段，我们要向得到问题最优解f(n)， 就需要对这两段绳子继续划分，这个时候f(n)的最优解就依赖于f(i)和f(n-i)，也就是一个整体的问题被分解成为了依赖与各个子问题的最优解。

对于这题的动态规划，我们依然使用递归的方案进行，值得注意的是，在每一步我们剪了一刀之后，有四种选择：直接计算，左边绳子继续剪，右边绳子继续剪，两边都继续剪。四种选择的最大值才是当前这种减法的最大值。

首先我们可以确定，当绳子长度为1,  2，3时，分别的最优解为0,1,2。其他长度都是基于此计算的

我们以一个实际例子来探讨：长度为4的绳子，我们有两种剪法：（1，3）、（2，2），我们定义一个数组[0， 0， 0， 0]，对于（1， 3）来说

- 不再剪：1 * 3 = 3
- 只剪左边：0 * 3 = 0
- 只剪右边：1 * 2 = 2
- 两边都继续剪：0 * 2 = 0
得到一个数组[3, 0, 2, 0]
继续对于（2， 2）进行上面的操作，更新数组为每一项最大值：[4, 2, 2, 1]

然后取得数组中的最大值为4，所以当绳子长度为四时答案为4

代码如下：

```javascript
function cutRope(number){
    if(number < 2) return 0
    if(number === 2) return 1
    if(number === 3) return 2
    let mid = Math.round(number / 2)
    let arr = []
    let a = Number.MIN_VALUE
    let b = Number.MIN_VALUE
    let c = Number.MIN_VALUE
    let d = Number.MIN_VALUE
    for(let i = 1; i <= mid; i++){
        a = a > (i * (number - i)) ? a : i * (number - i)
        b = b > cutRope(i) * (number - i) ? b : cutRope(i) * (number - i)
        c = c > i * cutRope(number - i) ? c : i * cutRope(number - i)
        d = d > cutRope(i) * cutRope(number - i) ? d : cutRope(i) * cutRope(number - i)
    }
    return Math.max(a, b, c, d)
}
```
接下来说说贪心算法，我们可以通过这个方法剪绳子，得到的结果将是最大：每次剪尽可能多长度为3 的绳子，如果剩下的长度为4，那么不是剪3，而是剪成两个2

关于这种做法正确性的证明：
![](/images/assets/20200313181506117.png)
代码如下：

```javascript
function cutRope(number){
    if(number < 2) return 0
    if(number === 2) return 1
    if(number === 3) return 2
    
    let n = Math.floor(number / 3)
    let k = number % 3
    if(k === 1){
        return Math.pow(3, (n - 1)) * 4
    }
    else{
        return Math.pow(3, n) * k
    }
}
```
