
if (!window.io) {
    window.io = require('socket-io');
    cc.log('use local socket-io.js');
}
var SocketIO = SocketIO || window.io;

const config = require('config');
const globalsInfo = require('globalsInfo');

var Test = {
    ip:"",
    port:null,
    instance:null,
    socket:null,
    onConnect:null,
    
	getNetworkInstance:function(){
        cc.log('getNetworkInstance '+this.ip+":"+this.port);
        //var SocketIO = SocketIO || window.io;
        var socket = SocketIO.connect(this.ip+":"+this.port, {"force new connection" : true});
        socket.on("connect", this.onConnect);
        var that = this;
        socket.on("disconnect", function() {
            that.instance=null;
            globalsInfo.netstaus=88;
            window.netstaus=88;
            cc.log('disconnect');
            cc.log('globalsInfo.netstaus:',window.netstaus);
        });
        socket.on("connect_timeout", function() {
            that.instance=null;
            cc.log('connect_timeout');
        });
        socket.on("error", function() {
            cc.log('error');
        });
        socket.on("connect_error", function() {
            cc.log('connect_error');
        });
        socket.on("ping", function() {
            cc.log('ping');
        });
        socket.on("pong", function() {
            cc.log('pong');
        });

            
		var networkInstance = {
		    close:function(){
		        socket.close();
		    },
            emit:function(eventName,obj){
                cc.log('emit:'+eventName,obj);
                cc.log('global',globalsInfo);
                //添加公共参数
                obj.versionCode=config.versionCode;
                obj.versionName=config.versionName;
                obj.userid=globalsInfo.userid,
                obj.token=globalsInfo.token;
                
                //JSON.stringify({'userid':userid,'token':token})
                socket.emit(eventName,JSON.stringify(obj));
            },
            listeneOn:function(eventName,callback){
                //socket.on(eventName,callback);
                var that = this;
                socket.on(eventName,function(obj){
                    if(/^"/.test(obj))
                        obj = eval(obj);
                    callback(obj);
                    //因为网络连接是全局的,多次调用on事件新的回调不会覆盖之前的导致callback中this对象跟他外面组成的闭包不对应
                    that.removeAllListeners(eventName);
                });
            },
            /*
            appendOn:function(eventName,callback){
                
                var that = this;
                socket.on(eventName,function(obj){
                    if(/^"/.test(obj))
                        obj = eval(obj);
                    callback(obj);
                    //因为网络连接是全局的,多次调用on事件新的回调不会覆盖之前的导致callback中this对象跟他外面组成的闭包不对应
                    that.removeAllListeners(eventName);
                });
            },
            */
            //一个事件只有一个回调，这里没有做预防,只能是调用的地方做（目前是）
            onOneEventOneFunc:function(eventName,callback){
                //web版,对同一个eventName添加事件是不会覆盖的，是通过连接存起来的。android中socket.on每个eventName只有一个回调事件
                if (!cc.sys.isNative) {
                    socket.removeAllListeners(eventName);
                }
                socket.on(eventName,function(obj){
                    if(/^"/.test(obj))
                        obj = eval(obj);
                    callback(obj);
                });
            },
            removeAllListeners:function(event){
                //这里有平台问题
                socket.removeAllListeners(event);  
            },
		};
		return networkInstance;
	},
	getInstance:function(ip,port,onConnect){
        if(ip===undefined && this.ip===undefined)
            this.ip=config.serverIp;
        else{
            this.ip=ip;
            window.netstaus=0;
        }
        if(port===undefined && this.port===undefined)
            this.port=config.serverPort;
        else
            this.port=port;
            
        cc.log('ip:',this.ip,' port:'+this.port);
            
        if(onConnect===undefined && this.onConnect===undefined)
            this.onConnect=function(){
                cc.log('default onConnect');
            };
        else
            this.onConnect = onConnect;
        
		if(this.instance === null || 1){
		    
		    globalsInfo.netstaus=-4;
		    //window.netstaus=-4;
		    cc.log('new networkInstance',window.netstaus);
			this.instance = this.getNetworkInstance();
		}
		if(globalsInfo.netstaus!==88)
		    window.netstaus--;
		return this.instance;
	},
};

module.exports=Test;