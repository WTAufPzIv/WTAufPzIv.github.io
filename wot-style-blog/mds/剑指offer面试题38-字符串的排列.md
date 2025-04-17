---
date: 2020-03-15
categories: [技术,计算机通识,数据结构与算法]
thumbnail: /images/fe/offer.jpg
toc: true
---

# 剑指offer面试题38：字符串的排列
<!--more-->
题目描述
输入一个字符串,按字典序打印出该字符串中字符的所有排列。例如输入字符串abc,则打印出由字符a,b,c所能排列出来的所有字符串abc,acb,bac,bca,cab和cba。

思路：这道题使用的是动态规划和递归的思想。对于输入的一个字符串，可以把它分为两个部分：首字母和剩下的部分。然后对剩下的部分进行递归处理，在递归的过程中，使用一个栈记录递归的路径，对于传入的非空字符串，先将首字母入栈，然后递归剩下的部分， 然后该字母出栈。当到达递归终点：传入的字符串是个空串，那么就将当前栈内保存的路径加入到结果集数组里面。

注意：这个方法需要注意遇到诸如'aa'这样的串，只有一种排列。

代码如下：

```javascript
function Permutation(str)
{
    // write code here
    if(str.length === 0) return []
    let arr = []
    let res = []
    let stack = []
    let obj = {}
    solve(str, arr, stack)
    for(let i = 0; i < arr.length; i++){
        res.push(arr[i].toString().replace(/,/g, ''))
    }
    for(let i = 0; i < res.length; i++){
        obj.hasOwnProperty(res[i])
        obj[res[i]] = 1
    }
    res = []
    for(let i in obj){
        res.push(i)
    }
    return res
}
function solve(str, arr, stack){
    if(str.length > 0){
        for(let i = 0; i < str.length; i++){
        	//分别将所有字符都设置为首字符
            stack.push(str[i])
            let flag = str.slice(0, i) + str.slice(i + 1, str.length) + ''
            //剩下的串进行递归
            solve(flag, arr, stack)
            //递归完成，当前首字符出栈
            stack.pop()
        }
    }   
    else{
        arr.push(JSON.parse(JSON.stringify(stack)))
    }
    
}
```
