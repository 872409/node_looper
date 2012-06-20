
var http = require("http");
var url = require("url");
var fs = require("fs");
var looper = require('./looper.js');
var stopWatch = require('./stopWatch.js').stopWatch;
var sw = new stopWatch('Looper Test');

//执行方式
var getImage = function(looper,index){
		var _url  = "http://y0.ifengimg.com/2012/04/04/23533114.gif";
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



var t = 1;
if(t==1){
	sw.start("looper");
	//开启10000个任务，240个并行
	looper.each(0,10000,240,getImage,function(){
		console.log('all done!!!');
		sw.stop();
		console.log(sw.getRecord());
	});
}

function _for(){
	sw.start("for");
	for(var i=0;i<10000;i++){
		getImage({callback:function(i){
			// console.log("complate:"+i);
			if(i==999){
				console.log('all done!!!');
				sw.stop();
				console.log(sw.getRecord());
			}
		}},i);
	}
}
//直接运行用for来运行，马上就出错
// _for();