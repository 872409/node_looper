node_looper
===========

背景
-------------
工作中有一需求，用node异步采集图片,用fs.createWriteStream 保存图片，，由于系统对进程打开文件数量的限制，Mac OS X下打开 248 个文件，就出现 Error: connect EMFILE 错误
无奈，只好限制并行，于是就有了这么个looper.

举例
-------------

```  js

var http = require("http");
var url = require("url");
var fs = require("fs");
var looper = require('./looper.js');

//执行方式
var getImage = function(looper,index){
		var _url  = "http://y0.ifengimg.com/2012/04/04/23533114.gif";
		//打开过多文件时，就会出错：Error: connect EMFILE
		var file = fs.createWriteStream("download/"+index+".jpg");
		var options =  url.parse(_url);
		options.method = 'GET';
		var req = http.request(options, function(res) {
			res.on('data', function (data) {
				//下载中....
				file.write(data);
			});
			res.on('end', function() {
				file.end();
				console.log("complate\t:"+index+" : runing:"+looper.runing);
				//结束，回调
				looper.callback(index);
			});
		}).on('error', function(e) {
		  // console.log("error\t"+index+"\t:" + e.message);
		  //结束，回调
		  file.end();
		  looper.callback(index);
		});
		req.end();
		// console.log("req\t\t:"+index);
};



 
//开启10000个任务，240个并行,我的机器：MacBook Air OS X 10.8 这个值大于248就出错。
looper.each(0,10000,240,getImage,function(){
	console.log('all done!!!');
});

function _for(){
	for(var i=0;i<10000;i++){
		getImage({callback:function(i){
			// console.log("complate:"+i);
			if(i==999){
				console.log('all done!!!');
			}
		}},i);
	}
}

//直接运行用for来运行，马上就出错
// _for();
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
 - max:最大并行数 
 - run:执行函数 
 - callback:全部完成时回调 
