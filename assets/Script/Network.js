
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

var Test = {
    instance:undefined,
    onConnect:undefined,
    
	getInstance:function(ip,port,onConnect){
        cc.log('getNetworkInstance '+ip+":"+port);
        
        if(cc.sys.isObjectValid(_webSocket)){
            
        }else{
            _webSocket = new WebSocket("ws://"+config.serverIp+":"+config.serverPort);
            cc.log('_webSocket.readyState',WebSocket.OPEN);
            /*
            CONNECTING	0
            OPEN	1
            CLOSING	2
            CLOSED	3
            */
            _webSocket.onopen = function (event) {
                cc.log("Send Text WS was opened.",event);
                //_webSocket.send(JSON.stringify({name:'huangji',age:25}));
                onConnect();
            };
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
            _webSocket.onerror=function(){
                cc.log('onerror');
            };
            _webSocket.onclose=function(){
                cc.log('onclose');
            };
            _webSocket.emit=function(eventName,obj){
                cc.log('emit:'+eventName,obj);
                
                //添加公共参数
                obj.eventName=eventName;
                obj.versionCode=config.versionCode;
                obj.versionName=config.versionName;
                obj.userid=globalsInfo.userid,
                obj.token=globalsInfo.token;
                
                _webSocket.send(JSON.stringify(obj));
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
        return _webSocket;
	}
};

module.exports=Test;