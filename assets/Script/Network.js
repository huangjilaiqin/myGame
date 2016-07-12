
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
var netStatus=false;
var listeners={};
var globalListeners={};
var toSendMsgs=[];
var callbacks;

var resetWebSocet=function(){
    _webSocket.onopen = function (event) {
        netStatus=true;
        globalsInfo.netStatus=true;
        while(toSendMsgs.length){
            var datas = toSendMsgs.shift();
            _webSocket.emit(datas.eventName,datas.obj);
        }
    };
    _webSocket.onerror=function(arg){};
    _webSocket.onclose=function(arg){};
    _webSocket.onNotValid=function(){};
    listeners={};
    toSendMsgs=[];
    cc.log('resetWebSocet');
};

var initWebSocket=function(cbs) {
    if(cbs){
        callbacks=cbs;
        /*
        CONNECTING	0
        OPEN	1
        CLOSING	2
        CLOSED	3
        */

        if(callbacks.onConnect){
            _webSocket.onopen = function (event) {
                cc.log("Send Text WS was opened.");
                netStatus=true;
                globalsInfo.netStatus=true;
                callbacks.onConnect();
                while(toSendMsgs.length){
                    var datas = toSendMsgs.shift();
                    _webSocket.emit(datas.eventName,datas.obj);
                }
            };
        }
        
        if(callbacks.onError){
            //*
            _webSocket.onerror=function(arg){
                callbacks.onError(arg);
                netStatus=false;
                globalsInfo.netStatus=false;
                resetWebSocet();
            };
            //*/
            
        }
        if(callbacks.onClose){
            _webSocket.onclose=function(arg){
                callbacks.onClose();
                netStatus=false;
                globalsInfo.netStatus=false;
                resetWebSocet();
            };
            
        }
        if(callbacks.onNotValid){
            _webSocket.onNotValid=function(arg){
                callbacks.onNotValid();
            };
        }
    }
    
    _webSocket.onmessage=function(message){
        cc.log('onmessage',message);
        /*
        if(/^"/.test(obj))
            obj = eval(obj);
            */
        try{
            var msg = JSON.parse(message.data);
        }catch(e){
            console.log(e);
            return;
        }
        var eventName = msg.eventName;

        //全局监听函数,全局优先处理
        var cbs = globalListeners[eventName];
        if(cbs){
            for(var i=0;i<cbs.length;i++){
                cbs[i](msg);
            }
        }

        cbs = listeners[eventName];
        if(cbs){
            for(var i=0;i<cbs.length;i++){
                cbs[i](msg);
            }
        }
        
    };
    
    _webSocket.emit=function(eventName,obj){
        //_webSocket.send('client emit');
        if(cc.sys.isObjectValid(_webSocket) && netStatus && _webSocket.readyState==1){
            //添加公共参数
            obj.eventName=eventName;
            obj.versionCode=config.versionCode;
            obj.versionName=config.versionName;
            obj.userid=globalsInfo.userid;
            obj.token=globalsInfo.token;
            //cc.log('emit socket:', JSON.stringify(obj));
            _webSocket.send(JSON.stringify(obj));
        }else if(_webSocket.readyState==0){
            //cc.log('emit not ready socket:', JSON.stringify(obj));
            toSendMsgs.push({eventName:eventName,obj:obj});
        }else{
            //cc.log('emit onNotValid');
            _webSocket.onNotValid();
        }
    };
    /*
    回调函数为全局函数,不涉及this,不会重复添加
    */
    _webSocket.listeneOn=function(eventName,callback){
        if(globalListeners[eventName]===undefined)
            globalListeners[eventName]=[];
        globalListeners[eventName].push(callback);
    };
    _webSocket.onOneEventOneFunc=function(eventName,callback) {
        listeners[eventName]=[callback];
    };
};

var Test = {
    
	getInstance:function(ip,port,cbs){
        cc.log('getNetworkInstance '+ip+":"+port);
        if(cc.sys.isObjectValid(_webSocket) && netStatus){
            if(cbs){
                initWebSocket(cbs);
            }
        }else{
            _webSocket = new WebSocket("ws://"+config.serverIp+":"+config.serverPort);
            
            cc.log('new _webSocket');
            resetWebSocet();
            initWebSocket(cbs);
            
            //初始化全局监听函数
            globalsInfo.initGlobalListeners(_webSocket);
        }
        return _webSocket;
	}
};

module.exports=Test;