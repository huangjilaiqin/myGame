
/*
if (!window.io) {
    window.io = require('socket-io');
    cc.log('use local socket-io.js');
}
var SocketIO = SocketIO || window.io;
*/




const config = require('config');
const globalsInfo = require('globalsInfo');

var _webSocket;
var listeners={};

var initWebSocket=function(cbs) {
    /*
    CONNECTING	0
    OPEN	1
    CLOSING	2
    CLOSED	3
    */
    if(cbs.onConnect){
        _webSocket.onopen = function (event) {
            cc.log("Send Text WS was opened.",event);
            cbs.onConnect();
        };
    }
    _webSocket.onmessage=function(message){
        cc.log('onmessage',message.data);
        /*
        if(/^"/.test(obj))
            obj = eval(obj);
            */
        var msg = JSON.parse(message.data);
        var eventName = msg.eventName;
        var callbacks = listeners[eventName];
        if(callbacks){
            for(var i=0;i<callbacks.length;i++){
                callbacks[i](msg);
            }
        }
    };
    if(cbs.onError){
        //*
        _webSocket.onerror=function(){
            cc.log('onerror',arguments);
            cc.log('onerror',_webSocket.extensions);
            cbs.onError(args);
        };
        //*/
    }
    if(cbs.onClose){
        _webSocket.onclose=function(args,arg2){
            cc.log('onclose',arguments);
            cbs.onClose();
        };
    }
    _webSocket.emit=function(eventName,obj){
        cc.log('emit:'+eventName,obj);
        cc.log('cc.sys.isObjectValid ',cc.sys.isObjectValid(_webSocket));

        if(cc.sys.isObjectValid(_webSocket)){
            //添加公共参数
            obj.eventName=eventName;
            obj.versionCode=config.versionCode;
            obj.versionName=config.versionName;
            obj.userid=globalsInfo.userid;
            obj.token=globalsInfo.token;
            
            _webSocket.send(JSON.stringify(obj));
        }else{
            cbs.onNotValid();
        }
    };
    /*
    回调函数为全局函数,不涉及this,不会重复添加
    */
    _webSocket.listeneOn=function(eventName,callback){
        if(listeners[eventName]===undefined)
            listeners[eventName]=[];
        listeners[eventName].push(callback);
    };
    _webSocket.onOneEventOneFunc=function(eventName,callback) {
        listeners[eventName]=[callback];
    }
}

var Test = {
    
	getInstance:function(ip,port,cbs){
        cc.log('getNetworkInstance '+ip+":"+port);
        cc.log('cc.sys.isObjectValid ',cc.sys.isObjectValid(_webSocket));
        if(cc.sys.isObjectValid(_webSocket)){
            if(cbs){
                initWebSocket(cbs);
            }
        }else{
            _webSocket = new WebSocket("ws://"+config.serverIp+":"+config.serverPort);
            
            initWebSocket(cbs);
        }
        return _webSocket;
	}
};

module.exports=Test;