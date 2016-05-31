//Network.js
var SocketIO = SocketIO || window.io;

cc.Class({
    extends:cc.Component,
    
    ip:"",
    port:null,
    instance:null,
    socket:null,
    
	getNetworkInstance:function(ip,port,onConnect){
        cc.log('getNetworkInstance '+this.ip+":"+this.port);
        var socket = SocketIO.connect(this.ip+":"+this.port);
        socket.on("connect", onConnect);
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
                //cc.log(eventName,obj);
                socket.emit(eventName,obj);
            },
            listeneOn:function(eventName,callback){
                socket.on(eventName,callback);
            },
		};
		return networkInstance;
	},
	getInstance:function(ip,port,onConnect){
        if(this.ip===undefined)
            this.ip="123.59.40.113";
        else
            this.ip=ip;
            
        if(this.port===undefined)
            this.port=5002;
        else
            this.port=port;
            
        if(onConnect===undefined)
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
	
});
