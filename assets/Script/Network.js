
const config = require('config');
const globalsInfo = require('globalsInfo');

var _webSocket;
var netStatus=false;
var listeners={};
var globalListeners={};
var toSendMsgs=[];
var networkErrorHandler;

var resetWebSocet=function(){
    _webSocket.onopen = function (event) {
        cc.log('default onopen');
        netStatus=true;
        globalsInfo.netStatus=true;
        while(toSendMsgs.length){
            var datas = toSendMsgs.shift();
            _webSocket.emit(datas.eventName,datas.obj);
        }
    };
    _webSocket.onerror=function(arg){
        cc.log('default onerror');
        netStatus=false;
        globalsInfo.netStatus=false;
        resetWebSocet();
    };
    _webSocket.onclose=function(arg){
        cc.log('default onclose');
        netStatus=false;
        globalsInfo.netStatus=false;
        //resetWebSocet();
    };
    _webSocket.onNotValid=function(){
        cc.log('default onNotValid');
    };
    listeners={};
    globalListeners={};
    toSendMsgs=[];
    cc.log('resetWebSocet');
};

var initWebSocket=function() {
    _webSocket.onmessage=function(message){
        cc.log('onmessage',message.data);
        /*
        if(/^"/.test(obj))
            obj = eval(obj);
            */
        var msg;
        try{
            msg = JSON.parse(message.data);
        }catch(e){
            console.log(JSON.stringify(e));
            return;
        }
        var eventName = msg.eventName;
        cc.log('onmessage',eventName);

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
        if(cc.sys.isObjectValid(_webSocket) && netStatus && _webSocket.readyState===1){
            //添加公共参数
            obj.eventName=eventName;
            obj.versionCode=config.versionCode;
            obj.versionName=config.versionName;
            obj.userid=globalsInfo.userid;
            obj.token=globalsInfo.token;
            cc.log('emit socket:', JSON.stringify(obj));
            _webSocket.send(JSON.stringify(obj));
        }else if(_webSocket.readyState===0){
            cc.log('emit not ready socket:', JSON.stringify(obj));
            toSendMsgs.push({eventName:eventName,obj:obj});
        }else{
            cc.log('emit onNotValid');
            //_webSocket.onNotValid();
            var msg={error:'网络错误',errno:8001};
            var cbs = globalListeners[eventName];
            if(cbs){
                for(var i=0;i<cbs.length;i++){
                    cbs[i](msg);
                }
            }
    
            cbs = listeners[eventName];
            cc.log(listeners);
            if(cbs){
                cc.log('onNotValid callback');
                for(var i=0;i<cbs.length;i++){
                    cbs[i](msg);
                }
            }
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
        cc.log('onOneEventOneFunc:',eventName);
        listeners[eventName]=[callback];
    };
    initNetworkErrorHandler();
};

var initNetworkErrorHandler=function(){
    if(networkErrorHandler){
        /*
        CONNECTING	0
        OPEN	1
        CLOSING	2
        CLOSED	3
        */

        if(networkErrorHandler.onConnect){
            _webSocket.onopen = function (event) {
                cc.log("WS was onConnect.");
                netStatus=true;
                globalsInfo.netStatus=true;
                networkErrorHandler.onConnect();
                while(toSendMsgs.length){
                    var datas = toSendMsgs.shift();
                    _webSocket.emit(datas.eventName,datas.obj);
                }
            };
        }
        
        if(networkErrorHandler.onError){
            //*
            _webSocket.onerror=function(arg){
                networkErrorHandler.onError(arg);
                netStatus=false;
                globalsInfo.netStatus=false;
                resetWebSocet();
            };
            //*/
            
        }
        if(networkErrorHandler.onClose){
            _webSocket.onclose=function(arg){
                networkErrorHandler.onClose();
                netStatus=false;
                globalsInfo.netStatus=false;
                //resetWebSocet();
            };
            
        }
        if(networkErrorHandler.onNotValid){
            _webSocket.onNotValid=function(arg){
                networkErrorHandler.onNotValid();
            };
        }
    }
};

var Test = {
	getInstance:function(ip,port){
        cc.log('getNetworkInstance '+ip+":"+port,netStatus);
        if(cc.sys.isObjectValid(_webSocket) && netStatus){
            initWebSocket();
        }else{
            if(cc.sys.isObjectValid(_webSocket)){
                _webSocket.close();
                cc.log('close _webSocket');
            }
            _webSocket = new WebSocket("ws://"+config.serverIp+":"+config.serverPort);
            _webSocket.myid=new Date().getTime();
            cc.log(_webSocket);
            cc.log('new _webSocket');
            resetWebSocet();
            initWebSocket();
            
            //初始化全局监听函数
            globalsInfo.initGlobalListeners(_webSocket);
        }
        
        return _webSocket;
	},
	setNetworkErrorHandler:function(cbs){
        networkErrorHandler=cbs;
    },
};

module.exports=Test;