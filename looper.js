(function(){
	 var looper = {};
	 var root = this;
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = looper;
    }
    else {
        root.looper = looper;
    }

    if (typeof process === 'undefined' || !(process.nextTick)) {
        looper.nextTick = function (fn) {
            setTimeout(fn, 0);
        };
    }
    else {
        looper.nextTick = process.nextTick;
    }

   var _looper = function(setting,runFn,callback){
        this.name = setting.name||"";
        this.index = setting.begin||0;
        this.end = setting.end||0;
        this.max = Math.min(setting.max||10,this.end);
        this.runing = 0;
        this.runFunction = runFn;
        this.doneCallback = callback;
        
        this._next = function(){
            var m = this;
            looper.nextTick(function(){
                m.nextProcess();
            });
        };

        this.run = function(){
            for (var i = 0; i < this.max; i++) {
                this._next();
            };
        };
        
        this.nextProcess = function(){
            if((this.index>=this.end)||(this.runing>=this.max)){
                return;
            }
            this.runing++;
            this.process(this.index++);
        };
        
        this.process = function(i){
            var m = this;
            looper.nextTick(function(){
                m.runFunction.call(m.runner,m,i);
            });
        };
        this._callback = function(i){
            this.runing--;
            if(this.index==this.end&&this.runing==0){
                if(this.doneCallback){
                    this.doneCallback();
                }
                return;
            }
            this._next();
        };
        this.callback = function(i){
            var m = this;
             // m._callback();
            looper.nextTick(function(){m._callback();});
        };
    };

    looper.create = function(setting,runFunction,callback){
        return new _looper(setting,runFunction,callback);
    };

    looper.each = function(begin,end,max,run,callback){
        new _looper({begin:begin,end:end,max:max},run,callback).run();
    };


}());
