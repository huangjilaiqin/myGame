
if (!window.io) {
    window.io = require('socket-io');
    cc.log('use local socket-io.js');
}
var SocketIO = SocketIO || window.io;

const config = require('config');
const globalsInfo = require('globalsInfo');

var Test = {
    instance:undefined,
    onConnect:undefined,
    
	getNetworkInstance:function(ip,port,onConnect){
        cc.log('getNetworkInstance '+ip+":"+port);
        //var SocketIO = SocketIO || window.io;
        var socket = SocketIO.connect(ip+":"+port, {"forceNew" : true,"reconnection":true,"transports":["websocket","polling"]});
        socket.on("connect", onConnect);
        
        var that = this;
        socket.on("disconnect", function() {
            that.instance=undefined;
            globalsInfo.netstaus=88;
            window.netstaus=88;
            cc.log('disconnect window.netstaus:',window.netstaus);
            if(that.instance === undefined){
                cc.log('instance is undefined');
            }else{
                cc.log('instance is not undefined');
            }
        });
        socket.on("connect_timeout", function() {
            that.instance=undefined;
            cc.log('connect_timeout');
        });
        socket.on("error", function() {
            cc.log('error');
        });
        socket.on("connect_error", function() {
            cc.log('connect_error');
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
        if(ip===undefined)
            ip=config.serverIp;
        else{
            window.netstaus=0;
        }
        if(port===undefined)
            port=config.serverPort;
            
        if(onConnect===undefined && this.onConnect===undefined)
            onConnect=function(){
                cc.log('default onConnect');
            };
        else
            this.onConnect=onConnect;
        
		if(this.instance === undefined){
		    window.netstaus=-4;
		    cc.log('new networkInstance ',window.netstaus,ip,port);
			this.instance = this.getNetworkInstance(ip,port,onConnect);
		}
		if(globalsInfo.netstaus!==88)
		    window.netstaus--;
		return this.instance;
	},
};

module.exports=Test;