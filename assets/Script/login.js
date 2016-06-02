
const Network = require('Network');
const globalsInfo = require('globalsInfo');

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        username:{
            default:null,
            type:cc.EditBox,
        },
        passwd:{
            default:null,
            type:cc.EditBox,
        },
        tip:{
            default:null,
            type:cc.Label,
        },
    },

    // use this for initialization
    onLoad: function () {
        
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    login:function(){
        var username = this.username.string;
        var passwd = this.passwd.string;
        var netInstance = Network.getInstance();
        
        //转圈圈
        var that = this;
        netInstance.emit('login', JSON.stringify({'username':username,'passwd':passwd}));
        netInstance.listeneOn('login', function(obj){
            that.tip.string = obj;
            var result = JSON.parse(obj);
            if(result.error){
                //提示
                cc.log("login: "+result.error);
                //this.tip.string = result.error;
            }else{
                var userid = result.userid;
                var token = result.token;
                
                cc.log('login success',userid,token);
                
                globalsInfo.userid=userid;
                globalsInfo.token=token;
                globalsInfo.username=username;
    
                /*
                // android 有问题
                cc.sys.localStorage.setItem('userid',userid);
                cc.sys.localStorage.setItem('username',username);
                cc.sys.localStorage.setItem('token',token);
                //*/
                cc.director.loadScene('main');
            }
        });   
    },
    register:function(){
        var username = this.username.string;
        var passwd = this.passwd.string;
        var netInstance = Network.getInstance();
        
        cc.log('register()',this.username.string,this.passwd.string);
        netInstance.emit('register', JSON.stringify({'username':username,'passwd':passwd}));
        
        netInstance.listeneOn('register', function(obj){
            var result = JSON.parse(obj);
            if(result.error){
                //提示
                cc.log("register: "+result.error);
            }else{
                var userid = result.userid;
                cc.log('register success, userid:'+userid);
    
                //播放注册成功动画
            }
        });   
    },
});
