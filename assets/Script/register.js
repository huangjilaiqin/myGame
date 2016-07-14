
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
        comfirmPasswd:{
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
    
    register:function(){
        var username = this.username.string.trim();
        var passwd = this.passwd.string.trim();
        var comfirmPasswd = this.comfirmPasswd.string.trim();
        
        this.tip.string=" ";
        if(username.length===0 || passwd.length===0 || comfirmPasswd.length===0){
            this.tip.string = "账号密码不能为空";
            return;
        }
        if(passwd!=comfirmPasswd){
            this.tip.string = "密码不一致";
            return;
        }
        
        var netInstance = Network.getInstance();
        
        var loading = cc.instantiate(this.loadingPrefab);
        loading.setPosition(cc.p(0,0));
        this.node.addChild(loading,1,2000);
        
        var that = this;
        netInstance.emit('register', {'username':username,'passwd':passwd});
        netInstance.onOneEventOneFunc('register', function(result){
            that.node.removeChildByTag(2000);
            if(result.error){
                //提示
                cc.log("register: "+result.error);
                that.tip.string = result.error;
            }else{
                globalsInfo.userid=result.userid;
                globalsInfo.username=result.username;
                that.tip.string = '注册成功,请登录';
                //播放注册成功动画
                that.scheduleOnce(function(){
                    cc.director.loadScene('login');
                },1);
            }
        });   
    },
    back:function(){
        cc.director.loadScene('login');
    }
});
