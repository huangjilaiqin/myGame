var SocketIO = SocketIO || window.io;
var Test = {
    test:function(){
        cc.log('Test.test()');
        return 'Test return';
    },
    ip:"",
    port:null,
    instance:null,
    socket:null,
    onConnect:null,
    
	getNetworkInstance:function(){
        cc.log('getNetworkInstance '+this.ip+":"+this.port);
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
                cc.log(eventName,obj);
                socket.emit(eventName,obj);
            },
            listeneOn:function(eventName,callback){
                //socket.on(eventName,callback);
                socket.on(eventName,function(obj){
                    if(/^"/.test(obj))
                        obj = eval(obj);
                    callback(obj);
                });
            },
		};
		return networkInstance;
	},
	getInstance:function(ip,port,onConnect){
        if(ip===undefined && this.ip===undefined)
            this.ip="123.59.40.113";
        else
            this.ip=ip;
            
        if(port===undefined && this.port===undefined)
            this.port=5002;
        else
            this.port=port;
            
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