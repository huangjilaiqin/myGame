
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
        toastPrefab: {
            default: null,
            type: cc.Prefab
        },
        registerBt:{
            default:null,
            type:cc.Button,
        },
        qqRegisterBt:{
            default:null,
            type:cc.Button,
        },
        thirdLoginTip:{
            default:null,
            type:cc.Label,
        },
    },

    // use this for initialization
    onLoad: function () {
        if(!cc.sys.isNative){
            //this.qqRegisterBt.node.active=false;
            //this.thirdLoginTip.node.active=false;
            cc.log('location:',location);
            //新用户验证后qq带着参数回调这个接口
            if(location.hash.indexOf('access_token')!=-1){
                cc.log('location access_token');
                var loading = cc.instantiate(this.loadingPrefab);
                loading.setPosition(cc.p(0,0));
                this.node.addChild(loading,1,2000);
                
                cc.log('main QC.Login.check():',QC.Login.check());
                QC.Login.getMe(function(openid, accessToken){
                    cc.log('login openId:',openid);
                    cc.log('login accessToken:',accessToken);
                    //发送登录协议
                    var requestObj = {
                        openid:openid,
                        accessToken:accessToken,
                        logintype:1,
                        registerFrom:globalsInfo.comefrom,
                    };
                    this.sendLoginRequest(requestObj);
                    //绑定后清除location.hash
                }.bind(this));
            }else{
                //web版 qq登录初始化
                this.prepareWebQQLogin();
            }
        }else{
            this.registerBt.node.active=false;
        }
        
        
        window.scenename='login';
        if(globalsInfo.username!==null){
            this.username.string=globalsInfo.username;
        }
        
        if(globalsInfo.netStatus===false){
            this.tip.string='网络错误,请检查网络';
        }
        var that = this;
        //qq授权成功后调用登陆协议
        cc.eventManager.addCustomListener("qqLogin", function(event){
            //that.node.removeChildByTag(2000);
            var userData = event._userData;
            
            var openid = userData.openid;
            var accessToken = userData.access_token;
            
            cc.log("qqLogin onComplete:",JSON.stringify(userData));
            //cc.director.loadScene('test');
            //加载用户信息,走login协议
            
            var requestObj = {
                openid:openid,
                accessToken:accessToken,
                logintype:1,
                registerFrom:globalsInfo.comefrom
            };
            that.sendLoginRequest(requestObj);
        });
        
    },
    
    prepareWebQQLogin(){
        QC.Login({
           //btnId：插入按钮的节点id，必选
           btnId:"qqLoginBtn",    
           //用户需要确认的scope授权项，可选，默认all
           scope:"all",
           //按钮尺寸，可用值[A_XL| A_L| A_M| A_S|  B_M| B_S| C_S]，可选，默认B_S
           size: "A_XL"
       }, function(reqData, opts){//登录成功
           //根据返回数据，更换按钮显示状态方法
           var dom = document.getElementById(opts['btnId']),
           _logoutTemplate=[
                //头像
                '<span><img src="{figureurl}" class="{size_key}"/></span>',
                //昵称
                '<span>{nickname}</span>',
                //退出
                '<span><a href="javascript:QC.Login.signOut();">退出</a></span>'    
           ].join("");
           dom && (dom.innerHTML = QC.String.format(_logoutTemplate, {
               nickname : QC.String.escHTML(reqData.nickname), //做xss过滤
               figureurl : reqData.figureurl
           }));
           //模拟点击触发超链
           
       }, function(opts){//注销成功
             alert('QQ登录 注销成功');
       });
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
        
        
        //转圈圈
        var loading = cc.instantiate(this.loadingPrefab);
        loading.setPosition(cc.p(0,0));
        this.node.addChild(loading,1,2000);
        
        //var that = this;
        var requestObj = {
            username:username,
            passwd:passwd
        };
        this.sendLoginRequest(requestObj);
    },
    sendLoginRequest:function(obj){
        var that = this;
        var netInstance = Network.getInstance();
        netInstance.onOneEventOneFunc('login', function(result){
            cc.log('login back',result);
            if(that.node!==undefined)
                that.node.removeChildByTag(2000);
            
            if(result.error){
                //提示
                cc.log("login: "+result.error);
                that.tip.string = result.error;
            }else{
                var userid = result.userid;
                var token = result.token;
                var username = result.username;
                
                cc.log('login success',userid,token);
                globalsInfo.userid=userid;
                globalsInfo.token=token;
                globalsInfo.username=username;
                globalsInfo.openid=result.openid;
                globalsInfo.logintype=result.logintype;
                
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
                cc.sys.localStorage.setItem('openid',result.openid);
                cc.sys.localStorage.setItem('logintype',result.logintype);
                
                //that.tip.string=cc.sys.localStorage.getItem('userid');
                //*/
                that.sendBaseInfo();
                cc.director.loadScene('main');
            }
        });   
        netInstance.emit('login', obj);
    },
    qqLogin:function(){
        if(cc.sys.isNative){
            var loading = cc.instantiate(this.loadingPrefab);
            loading.setPosition(cc.p(0,0));
            this.node.addChild(loading,1,2000);
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "qqLogin", "()V");
        }else{
            /*
            var toast = cc.instantiate(this.toastPrefab);
            toast.getComponent('toast').init('web版下个版本将支持QQ登录',3);
            this.node.addChild(toast,1);
            QC.Login({//按默认样式插入QQ登录按钮
        		btnId:"qq_login_btn"	//插入按钮的节点id
        	});*/
        	//调用QC.Login方法，指定btnId参数将按钮绑定在容器节点中
        	cc.log(document.getElementById('qqLoginBtn'));
        	cc.log(document.getElementById('qqLoginBtn').firstChild);
        	var loginStr = document.getElementById('qqLoginBtn').firstChild.getAttribute('onClick');
            cc.log(typeof(loginStr));
            loginStr=loginStr.replace("return window.open('","");
            loginStr=loginStr.replace("'","");
            cc.log(loginStr);
            var loginArr=loginStr.split(",");
            cc.log(loginArr);
            var qqLoginUrl = loginArr[0];
            cc.log(qqLoginUrl);
            //eval(loginStr);
            window.location.href=qqLoginUrl;
            //window.open(qqLoginUrl);
        }
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
        cc.log('login baseInfo',info);
        var netInstance = Network.getInstance();
        netInstance.onOneEventOneFunc('baseInfo', function(result){
            cc.log('baseInfo back',result);
        });
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
