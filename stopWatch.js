var stopWatch = function( timerName ) {
    this.timerName = timerName;
    this.resultQueue = [];
    this.tag = "test";
}
 
// 秒表的属性函数
stopWatch.prototype = {
    start : function( tag ) {
        this.tag = tag;
        this.timerSt = new Date();
    },
    stop : function() {
        var ts = new Date() - this.timerSt;
        this.resultQueue.push( this.tag + ' -> ' + ts + 'ms' );
    },
    getRecord : function( clear ) {
        var s = this.resultQueue.join("\n");
        if ( clear ) this.clear();
        return "StopWatch [" + this.timerName +  "]\n=============================\n" + s;
    },
    reset : function() {
        this.resultQueue = [];
    }
};
exports = exports||{};
exports.stopWatch = stopWatch;