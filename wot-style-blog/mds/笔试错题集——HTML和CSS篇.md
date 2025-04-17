---
date: 2020-03-14
categories: [技术,前端,面经笔经]
thumbnail: /images/fe/1.png
toc: true
---


# 第一题

<!--more-->
![](/images/assets/20200313213110422.png)
id选择器是css1的

# 第二题
![](/images/assets/20200313213317418.png)
1.div:first-child
要满足的条件，首先必须得是div元素，还得是第一个子元素，如果不满足 就不会被选中

2.div:first-of-type
要满足的条件，首先必须得是div元素，还得是第一个出现的div元素，如果不满足 就不会被选中

3.nth-child
a:nth-child(5)： 必须是a元素 必须是第五个子元素

4.nth-of-type：
a:nth-of-type:选中所有a元素中的第n个a元素

# 第三题
![](/images/assets/2020031321363574.png)
- ele.clientWidth = 宽度 + padding

- ele.offsetWidth = 宽度 + padding + border

- ele.scrollTop = 被卷去的上侧距离

- ele.scrollHeight = 自身实际的高度（不包括边框）

# 第四题
![](/images/assets/20200313213746309.png)
`<track>` 标签为诸如 video 元素之类的媒介规定外部文本轨道。用于规定字幕文件或其他包含文本的文件，当媒介播放时，**这些文件是可见的。**

# 第五题
![](/images/assets/20200313214037249.png)
![](/images/assets/2020031321410886.png)
注意#会跳转到页面顶部，所以这题不选a

# 第六题
![](/images/assets/20200313214415824.png)
其中 font 标签，存在反语义（ font 解释为文字，但 ”文字“ 意思太泛了，而是应根据使用环境选择其他标签。如标题 `<h1> ~ <h6> <p>`等标签）
在 HTML 4.01 中，不被赞成使用；

# 第七题
![](/images/assets/20200313214504131.png)
![](/images/assets/20200313214532499.png)
不是所有标签都需要结束标签，例如`-<a>`；doctype类型会影响；HTML标签对大小写不敏感，为了规范，推荐小写。

# 第八题
![](/images/assets/20200313214729949.png)
multiple用于**select的多选**或者**上传多个文件**


categories: [前端,面经笔经]
thumbnail: /images/fe/1.png
toc: true
第一题

id选择器是css1的

第二题

1.div:first-child
要满足的条件，首先必须得是div元素，还得是第一个子元素，如果不满足 就不会被选中

2.div:first-of-type
要满足的条件，首先必须得是div元素，还得是第一个出现的div元素，如果不满足 就不会被选中

3.nth-child
a:nth-child(5)： 必须是a元素 必须是第五个子元素

4.nth-of-type：
a:nth-of-type:选中所有a元素中的第n个a元素

第三题


ele.clientWidth = 宽度 + padding

ele.offsetWidth = 宽度 + padding + border

ele.scrollTop = 被卷去的上侧距离

ele.scrollHeight = 自身实际的高度（不包括边框）

第四题

<track> 标签为诸如 video 元素之类的媒介规定外部文本轨道。用于规定字幕文件或其他包含文本的文件，当媒介播放时，这些文件是可见的。

第五题


注意#会跳转到页面顶部，所以这题不选a

第六题

其中 font 标签，存在反语义（ font 解释为文字，但 ”文字“ 意思太泛了，而是应根据使用环境选择其他标签。如标题 <h1> ~ <h6> <p>等标签）
在 HTML 4.01 中，不被赞成使用；

第七题


不是所有标签都需要结束标签，例如-<a>；doctype类型会影响；HTML标签对大小写不敏感，为了规范，推荐小写。

第八题

multiple用于select的多选或者上传多个文件

Markdown 2659 字数 62 行数 当前行 57, 当前列 5 文章已保存21:48:08HTML 667 字数 30 段落
已成功保存至草稿箱
