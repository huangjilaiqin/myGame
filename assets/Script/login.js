
const Network = require('Network');
const globalsInfo = require('globalsInfo');

cc.Class({
    extends: cc.Component,

    properties: {
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
        loadingPrefab: {
            default: null,
            type: cc.Prefab
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
        var loading = cc.instantiate(this.loadingPrefab);
        loading.setPosition(cc.p(0,0));
        this.node.addChild(loading,1,2000);
        
        var that = this;
        netInstance.emit('login', JSON.stringify({'username':username,'passwd':passwd}));
        netInstance.listeneOn('login', function(obj){
            that.node.removeChildByTag(2000);
            
            var result = JSON.parse(obj);
            
            that.tip.string = 'token:'+result.token+"#";
            //that.tip2.string = 'ok';
            
            if(result.error){
                //提示
                cc.log("login: "+result.error);
                that.tip.string = result.error;
            }else{
                var userid = result.userid;
                var token = result.token;
                
                cc.log('login success',userid,token);
                
                globalsInfo.userid=userid;
                globalsInfo.token=token;
                globalsInfo.username=username;
                
                globalsInfo.value=result.value;
                globalsInfo.total=result.total;
                globalsInfo.win=result.win;
                globalsInfo.draw=result.draw;
                globalsInfo.lost=result.lost;
                //此次是否重新登录
                globalsInfo.isLogin=true;
                //*
                // android 有问题
                //that.tip.string='login success:'+userid;
                cc.sys.localStorage.setItem('userid',userid);
                cc.sys.localStorage.setItem('username',username);
                cc.sys.localStorage.setItem('token',token);
                //that.tip.string=cc.sys.localStorage.getItem('userid');
                //*/
                cc.director.loadScene('main');
            }
        });   
    },
    register:function(){
        var username = this.username.string;
        var passwd = this.passwd.string;
        var netInstance = Network.getInstance();
        
        var loading = cc.instantiate(this.loadingPrefab);
        loading.setPosition(cc.p(0,0));
        this.node.addChild(loading,1,2000);
        
        var that = this;
        netInstance.emit('register', JSON.stringify({'username':username,'passwd':passwd}));
        netInstance.listeneOn('register', function(obj){
            that.node.removeChildByTag(2000);
            var result = JSON.parse(obj);
            if(result.error){
                //提示
                cc.log("register: "+result.error);
                that.tip.string = result.error;
            }else{
                var userid = result.userid;
                cc.log('register success, userid:'+userid);
                that.tip.string = '注册成功,请登录';
                //播放注册成功动画
            }
        });   
    },
});
