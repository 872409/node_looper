node_looper
===========

背景
-------------
工作中有一需求，用node异步采集图片，在网速很给力的情况下，由于socket限制，Mac OS X下循环500个http.get，就出现 Error: connect EMFILE 错误
无奈，只好限制并发，于是就有了这么个looper.

举例
-------------

```  js
var looper = require('./looper.js');
var getHtml = function(looper,index){
		var _url  = "http://res.img.ifeng.com/2012/0620/wm_6d5a038f3b8eff4f4da642d27bf29c19.jpg";//"http://www.baidu.com/";//
		var options =  url.parse(_url);
		options.method = 'GET';
		var req =http.request(options, function(res) {
			res.on('data', function (data) {
				//下载中....
			});
			res.on('end', function() {
				console.log("complate\t:"+index+" : runing:"+l.runing);
				looper.callback(index);
			});
		}).on('error', function(e) {
		  console.log("error\t"+index+"\t:" + e.message);
		  looper.callback(index);
		});
		req.end();
		console.log("req\t\t:"+index);
};

looper.each(0,100,10,getHtml,function(){
	sw.stop();
	console.log(sw.getRecord());
});
```

getHtml 执行函数,在looper里面会被调用执行具体的代码

参数:
 - looper 当前的looper,函数执行完前要利用looper进行回调 
 - index 当前循环索引 

```  js
looper.each(begin,end,max,run,callback)
```
参数:
 - begin:循环开始值 
 - end:循环结束值 
 - max:最大同步运行数量 
 - run:执行函数 
 - callback:全部完成时回调 
