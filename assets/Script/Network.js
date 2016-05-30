//Network.js
var SocketIO = SocketIO || window.io;

cc.Class({
    extends:cc.Component,
    
    ip:"",
    port:null,
    instance:null,
    socket:null,
    onConnect:function(){
        cc.log('onConnect');
    },
	getNetworkInstance:function(ip,port,onConnect){
        cc.log('getNetworkInstance '+this.ip+":"+this.port);
        this.socket = SocketIO.connect(this.ip+":"+this.port);
        this.socket.on("connect", onConnect);
        this.socket.on("disconnect", function() {
            cc.log('disconnect');
        });
        this.socket.on("connect_timeout", function() {
            cc.log('connect_timeout');
        });
        this.socket.on("error", function() {
            cc.log('error');
        });
        this.socket.on("connect_error", function() {
            cc.log('connect_error');
        });
        this.socket.on("ping", function() {
            cc.log('ping');
        });
        this.socket.on("pong", function() {
            cc.log('pong');
        });

            
		var networkInstance = {
            emit:function(eventName,obj){
                //cc.log(eventName,obj);
                this.socket.emit(eventName,obj);
            },
            listeneOn:function(eventName,callback){
                this.socket.on(eventName,callback);
            },
		};
		return networkInstance;
	},
	getInstance:function(ip,port,onConnect){
        if(this.ip===undefined || this.port===undefined){
            this.ip="123.59.40.113";
            this.port=5002;
        }else{
            this.ip=ip;
            this.port=port;
            this.onConnect = onConnect;
        }
		if(this.instance === null){
            cc.log('getNetworkInstance');
			this.instance = this.getNetworkInstance(this.ip,this.port,this.onConnect);
		}
		return this.instance;
	},
	
});
