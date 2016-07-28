
const Network = require('Network');
const globalsInfo = require('globalsInfo');
const config = require('config');

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
        learnTipPre: {
            default: null,
            type: cc.Prefab,
        },
    },

    // use this for initialization
    onLoad: function () {
        window.scenename='login';
        if(globalsInfo.username!==null){
            this.username.string=globalsInfo.username;
        }
        
        if(globalsInfo.netStatus===false){
            this.tip.string='网络错误,请检查网络';
        }
        
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    login:function(){
        var username = this.username.string;
        var passwd = this.passwd.string;
        this.tip.string=" ";
        if(username.length===0 || passwd.length===0){
            this.tip.string = "账号密码不能为空";
            return;
        }
        cc.log('login',username);
        
        var netInstance = Network.getInstance();
        //转圈圈
        var loading = cc.instantiate(this.loadingPrefab);
        loading.setPosition(cc.p(0,0));
        this.node.addChild(loading,1,2000);
        
        var that = this;
        
        netInstance.onOneEventOneFunc('login', function(result){
            if(that.node!==undefined)
                that.node.removeChildByTag(2000);
            
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
                
                globalsInfo.todaytask=result.todaytask;
                globalsInfo.todayamount=result.todayamount;
                globalsInfo.totalPercent=globalsInfo.todayamount/globalsInfo.todaytask;
                
                globalsInfo.remainhp=result.remainhp;
                globalsInfo.hp=result.hp;
                globalsInfo.hpPercent=globalsInfo.remainhp/globalsInfo.hp;
                
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
                that.sendBaseInfo();
                cc.director.loadScene('main');
            }
        });   
        netInstance.emit('login', {'username':username,'passwd':passwd});
    },
    sendBaseInfo:function(){
        var info={
            userid:globalsInfo.userid,
            token:globalsInfo.token,
            os:cc.sys.os,
            isBrowser:cc.sys.isBrowser,
            isMobile:cc.sys.isMobile,
            isNative:cc.sys.isNative,
            platform:cc.sys.platform,
            browserType:cc.sys.browserType,
            browserVersion:cc.sys.browserVersion,
            comefrom:globalsInfo.comefrom,
        };
        var netInstance = Network.getInstance();
        netInstance.emit('baseInfo',info);
    },
    register:function(){
          cc.director.loadScene('register');
    },
    getbackPasswd:function(){
        var learnTipPre = cc.instantiate(this.learnTipPre);
            
        this.node.addChild(learnTipPre,1,3000);
        var learnTip = learnTipPre.getComponent('learnTip');
        var that = this;
        learnTip.init("俯卧撑学院","请到下面#天天俯卧撑#官方QQ群联系管理员找回密码:\n\nQQ群: 553 689 366\n\n给您带来的不便深表歉意!",function(){
            that.node.removeChildByTag(3000);
        });
    },
});
