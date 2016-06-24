
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
        var socket = SocketIO.connect(this.ip+":"+this.port);
        socket.on("connect", this.onConnect);
        socket.on("disconnect", function() {
            cc.log('disconnect');
        });
        socket.on("connect_timeout", function() {
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
        else
            this.ip=ip;
            
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
        
		if(this.instance === null){
			this.instance = this.getNetworkInstance(this.ip,this.port,this.onConnect);
		}
		return this.instance;
	},
};

module.exports=Test;