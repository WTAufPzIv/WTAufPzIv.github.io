---
date: 2020-08-07
categoery: [技术,前端,JavaScript]
toc: true
---
# 介绍
现在不少app都会有一些抽奖活动，热门的抽奖当属九宫格循环抽奖，而还有一种抽奖形式也是比较常见，比如老虎机的形式

## 预期效果
![](/images/assets/20200804161721953.gif)
那么我们就用JQ和CSS实现一下这个效果。

<!-- more -->

# 简单的实现思路
其实这个效果和实现一个轮播图是有异曲同工之妙的

假设现在有1，2，3三个奖品，我们可以在一个ul内使用多个序列拼接成一个长列表:1--2--3--1--2--3--1--2--3--1--2--3.....以此类推

每一组1--2--3视为一个集合，抽奖开始从第一个集合的某个奖品开始，到最后一个集合的某个奖品结束，中间使用transition加transform实现动效。

当每一次抽奖动效完成后ul会挺在最后一个集合的元素上，这个时候就需要让ul‘瞬移’一下，移动到当前这个奖项对应的第一个集合中的奖项，以便下一次抽奖

有了这个大概的思路，就可以着手于实现了

## 先定义一下DOM结构
我们实现的是上文提到的那个例子，但是为了简洁，我们的dom结构就先定义简单一点

```html
<div class="game-content">
	<div class="game-goods-wrap">
		<div class="game-goods-list">
			<div class="game-goods" style="background: #ffffff;">
				<div class="game-goods-box" id="game1">
					<ul class="game-goods-ul"></ul>
				</div>
			</div>
			<div class="game-goods" style="background: #ffffff;">
				<div class="game-goods-box" id="game2">
					<ul class="game-goods-ul"></ul>
				</div>
			</div>
			<div class="game-goods" style="background: #ffffff;">
				<div class="game-goods-box" id="game3">
					<ul class="game-goods-ul"></ul>
				</div>
			</div>
		</div>
	</div>
	<span class="game-btn"></span>
</div>
```

## 核心动效的实现
然后我们开始书写核心动效实现的封装函数，对外提供可以配置的接口option：

```javascript
luckGame: function(options) {
	var defaults = {
		'gameLen': '10', // 奖品的数量
		'game_pagesize': 6,//生成多少圈同样的东西，调节速度用
		'zj_arr': { //中奖数组，第一个表示是否中奖，第二个中奖号码
			'is_win':1,
			'number':8
		}
	};
	var settings = Object.assgin(defaults, options);
	w_config={
		'w':$(window).width(),
		'h':$(window).height()
	}
	var gameArr=[]; // 奖品滚动的列表
	var gameLen=settings.gameLen; // 奖品的种类数量
	var game_list_h=''; // 奖品滚动列表的高度
	var game_init=[]; // 页面载入时随机的选择状态
	var game_list_item_h=0; // 单个奖品元素的高度

	//每次进来随机3个数字，来启动当前的选择的状态
	for (var i = 0; i < 3; i++) {
		game_init.push(Math.floor(Math.random() * gameLen));
	}
	createGame();
	$(window).resize(function(){	
		createGame();
	})
	// 初始化游戏
	function createGame(){
		getHeight();
		setLi();
		pushLi(gameArr);
		start();
	}


	function getHeight(){
		w_config={
			'w':$(window).width(),
			'h':$(window).height()
		}
		// 由于抽奖机本身的大小根据屏幕大小自适应，所以奖品高度需要计算
		// 实际场景下一般都是定高的
		game_list_item_h=(w_config.w*320/750*0.5*0.7).toFixed(2);
	}


	//设置奖品
	function setLi(){
		// 拼接实际的滚动数组
		for (var j = 1; j <= settings.game_pagesize; j++) {
			for (var i = 1; i <= gameLen; i++) {
				gameArr.push({'type':j,'index':i,'src':'images/'+i+'.png'});
			}
		}

		
	}
	//写入，初始化奖品的滚动
	function pushLi(arr){
		var html_str='';
		// 根据滚动数组生成li
		for (var i = 0; i < arr.length; i++) {
			html_str+='<li style="height:'+game_list_item_h+'px" data-index="' + arr[i]['index']+'" data-type="'+arr[i]['type']+'"><img src="' + arr[i]['src']+'"></li>';
		}
		$(".game-goods-ul").each(function(e){
			$(this).empty().append(html_str);
			game_list_h=$(this).height();
			console.log('game_list_item_h',game_init);
			y=game_list_item_h*game_init[e];
			
			$(this).css({
				'transition-duration': '0ms',
				'transform':'translate(0px, -'+y+'px) translateZ(0px)'
			})
		});
		
		
	}
	// 开始抽奖
	function start(){
		// 这一块是点击开始动效
		// 但实际场景中一般是点击之后和后台进行交互
		// 获取到中奖信息之后直接开始动效
        // 组件本身不负责点击事件
		$(".game-btn").click(function(){

			//如果中奖
			if(settings.zj_arr.is_win==1)
			{
				
				$(".game-goods-ul").each(function(e){

					setTimeout(function(){
						y=(settings.zj_arr.number+settings.gameLen*(settings.game_pagesize-1))*game_list_item_h;
						$(".game-goods-ul").eq(e).css({
							'transition-duration': '5000ms',
							'transform':'translate(0px, -'+y+'px) translateZ(0px)'
						})
					}, e*300);
					// 判断最后面是否完毕
					// 抽奖动画完成后回到type=1的地方，等待下一次抽奖
					$("#game3").find(".game-goods-ul").on("webkitTransitionEnd", function() {
						y=settings.zj_arr.number*game_list_item_h;
						$(".game-goods-ul").css({
							'transition-duration': '0ms',
							'transform':'translate(0px, -'+y+'px) translateZ(0px)'
						})
						$("#game3").find(".game-goods-ul").unbind("webkitTransitionEnd");
					})
				})
				
			}else
			{
				// 不中奖的时候哦生成随记停留的奖项，但是确保不能三个奖项一样
				numrand=randNum2();
				console.log(numrand);
				// 不中奖的时候
				$(".game-goods-ul").each(function(e){
					y2=(numrand[0])*game_list_item_h;
					y3=(numrand[1])*game_list_item_h;
					y4=(numrand[2])*game_list_item_h;
					setTimeout(function(){
						y=(numrand[e]+settings.gameLen*(settings.game_pagesize-1))*game_list_item_h;
						$(".game-goods-ul").eq(e).css({
							'transition-duration': '5000ms',
							'transform':'translate(0px, -'+y+'px) translateZ(0px)'
						})
					}, e*300);
					//判断最后面是否完毕
					// 抽奖动画完成后回到type=1的地方，等待下一次抽奖
					$("#game3").find(".game-goods-ul").on("webkitTransitionEnd", function() {
						
						$(".game-goods-ul").eq(2).css({
							'transition-duration': '00ms',
							'transform':'translate(0px, -'+y4+'px) translateZ(0px)'
						})
						$("#game3").find(".game-goods-ul").unbind("webkitTransitionEnd");
					})
					$("#game2").find(".game-goods-ul").on("webkitTransitionEnd", function() {
						
						$(".game-goods-ul").eq(1).css({
							'transition-duration': '00ms',
							'transform':'translate(0px, -'+y3+'px) translateZ(0px)'
						})
						$("#game2").find(".game-goods-ul").unbind("webkitTransitionEnd");
					})
					$("#game1").find(".game-goods-ul").on("webkitTransitionEnd", function() {
						
						$(".game-goods-ul").eq(0).css({
							'transition-duration': '00ms',
							'transform':'translate(0px, -'+y2+'px) translateZ(0px)'
						})
						$("#game1").find(".game-goods-ul").unbind("webkitTransitionEnd");
					})
				})

			}
			
			
		})
	}
	// 生成不中奖时候的随机显示序列
	function randNum2(){
		a=Math.floor(Math.random() * gameLen);
		b=Math.floor(Math.random() * gameLen);
		c=Math.floor(Math.random() * gameLen);
		arr=[];
		if(a==b)
		{
			return randNum2();
		}else
		{
			return arr=[a,b,c];
		}
	}
}
```
## 调用
然后我们就可以像这样传入配置，这一块实际场景中是点击按钮过后再传入配置，当配置传入之后调用函数，直接开始动画：

```javascript
luckGame({
	'zj_arr': {
		'is_win':1,
		'number':9//从0算起，就是10了
	},
	gameLen:10,//产品抽奖数量，
	game_pagesize:6
});
```


以上就是核心的动效实现，如果是使用vue或者react之类的框架，那么我们则只需要关注数据本身就行，由数据去驱动视图，省去了繁杂的DOM操作，整个过程会更加简洁。


