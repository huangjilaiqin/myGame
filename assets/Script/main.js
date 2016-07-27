const Utils = require('Utils');
const Network = require('Network');
const globalsInfo = require('globalsInfo');
const config = require('config');

var netInstance;

cc.Class({
    extends: cc.Component,
    properties: {
        bgAudio:{
            default:null,
            url:cc.AudioClip
        },
        searchPre: {
            default: null,
            type: cc.Prefab
        },
        total:{
            default:null,
            type:cc.Label,
        },
        win:{
            default:null,
            type:cc.Label,
        },
        draw:{
            default:null,
            type:cc.Label,
        },
        lost:{
            default:null,
            type:cc.Label,
        },
        volumeSettingBt:{
            default:null,
            type:cc.Button,
        },
        volumeOff:{
            default:null,
            type:cc.Sprite,
        },
        volumeOn:{
            default:null,
            type:cc.Sprite,
        },
        loadingPrefab: {
            default: null,
            type: cc.Prefab
        },
        toastPrefab: {
            default: null,
            type: cc.Prefab
        },
        broadcastPrefab:{
            default: null,
            type: cc.Prefab
        },
        hpPercent:{
            default:0,
            visible:false,
        },
        hpValueLabel:{
            default:null,
            type:cc.Label,
        },
        totalPercent:{
            default:0,
            visible:false,
        },
        totalValueLabel:{
            default:null,
            type:cc.Label,
        },
        hpProgressBar:{
            default:null,
            type:cc.ProgressBar,
        },
        totalProgressBar:{
            default:null,
            type:cc.ProgressBar,
        },
        hp:{
            default:null,
            type:cc.Sprite,
        },
        todaytask:{
            default:null,
            type:cc.Sprite,
        },
        receivePre:{
            default: null,
            type: cc.Prefab
        },
        settingPre:{
            default: null,
            type: cc.Prefab
        },
        username:{
            default:null,
            type:cc.Label,
        },
        ws:{
            default:null,
            visible:false,
        },
        finished:{
            default:null,
            type:cc.Sprite,
        },
        fightCool:{
            default:null,
            type:cc.ProgressBar,
        },
        cooldownTip:{
            default:null,
            type:cc.Label,
        },
        remainCoolTime:{
            default:null,
            type:cc.Label,
        },
    },
    changeVolumeBg:function(isOpen){
        if(isOpen){
            this.volumeOn.node.opacity=255;
            this.volumeOff.node.opacity=0;
        }else{
            this.volumeOn.node.opacity=0;
            this.volumeOff.node.opacity=255;
        }
    },
    initAction:function(){
        var scaleAction =cc.scaleBy(0.5, 0.8, 0.8);
        var scaleAction1 =cc.scaleBy(0.5, 1.25, 1.25);
        this.hp.node.runAction(cc.repeatForever(cc.sequence(scaleAction,scaleAction1)));
        
        var scaleAction2 =cc.scaleBy(0.5, 0.8, 0.8);
        var scaleAction3 =cc.scaleBy(0.5, 1.25, 1.25);
        this.todaytask.node.runAction(cc.repeatForever(cc.sequence(scaleAction2,scaleAction3)));
    },
    initListener:function() {
        var that = this;
        netInstance.onOneEventOneFunc('bonus',function(data){
            cc.log('bonus',data);

            if(globalsInfo.bonus===undefined){
                globalsInfo.bonus=data.datas;
            }else{
                for(var bonusRecordId in data.datas){
                    globalsInfo.bonus[bonusRecordId]=data.datas[bonusRecordId];
                }
            }
            if(that.name=='Canvas<main>'){
                cc.log('globalsInfo.bonus ',globalsInfo.bonus);
                for(var bonusRecordId in globalsInfo.bonus){
                    cc.log('bonusRecordId ',bonusRecordId);
                    that.getBonus(bonusRecordId);
                    break;
                }
            }
        });
        netInstance.emit('bonus',{});
    },
    showCooldownMsg:function(){
        //获取上一次比赛时间
        var delta = this.setCooldownPercent();
        //cc.log('delta:',delta);
        if(delta<this.cooldownTotalTime && delta>0){
            //当前时间
            //时间差
            //每秒定时更新信息
            
            var remainCoolTime = Math.floor(this.cooldownTotalTime-delta);
            //cc.log('remainCoolTime',remainCoolTime,this.cooldownTotalTime);
            var duoyu = delta-remainCoolTime;
            this.schedule(function(){
                if(remainCoolTime<=0 || this.isCooldown){
                    this.isCooldown=true;
                    this.cooldownTip.string='肌肉已处于最佳状态，战斗吧，勇士！';
                    this.remainCoolTime.string='';
                }else{
                    this.isCooldown=false;
                    this.remainCoolTime.string = remainCoolTime+'秒';
                    
                    var chushu = Math.floor(remainCoolTime/(this.cooldownTotalTime/5));
                    var msg =  this.cooldownMsgs[chushu];
                    var yushu = remainCoolTime%3;
                    //msg += this.cooldownDots[yushu];
                    this.cooldownTip.string = msg;
                    cc.log(remainCoolTime,chushu,yushu);
                    remainCoolTime--;
                }
            },1,remainCoolTime);
        }else{
            this.fightCool.progress=0;
            this.isCooldown=true;
            this.cooldownTip.string='肌肉已处于最佳状态，战斗吧，勇士！';
            this.remainCoolTime.string='';
        }
    },
    setCooldownPercent:function(){
        var lastfighttime=globalsInfo.lastfighttime;
        if(lastfighttime){
            lastfighttime = new Date(Date.parse(globalsInfo.lastfighttime));
            var delta = (new Date().getTime()-lastfighttime.getTime())/1000;
            //cc.log(new Date(),lastfighttime,delta);
            var percent=0;
            if(delta<this.cooldownTotalTime){
                percent = (this.cooldownTotalTime-delta)/this.cooldownTotalTime;
            }else{
                this.cooldownTip.string='肌肉已处于最佳状态，战斗吧，勇士！';
                this.remainCoolTime.string='';
                this.isCooldown=true;
            }
            this.fightCool.progress=percent;
            return delta;
        }else{
            cc.log('no lasttighttime');
            return -1;
        }
    },
    // use this for initialization
    onLoad: function () {
        cc.log(cc.audioEngine);
        window.scenename='main';
        globalsInfo.scenename='main';
        //界面动效
        this.initAction();
        
        this.cooldownMsgs=['三角肌冷却中...','肘肌冷却中...','胸小肌冷却中...','肱三头肌冷却中...','胸大肌冷却中...'];
        this.cooldownDots=['...','..','.'];
        this.cooldownTotalTime=180;
        this.isCooldown=false;
        
        globalsInfo.lastfighttime=cc.sys.localStorage.getItem('lastfighttime');
        
        var isVolumeOpen = cc.sys.localStorage.getItem('isVolumeOpen');
        if(isVolumeOpen===null){
            cc.sys.localStorage.setItem('isVolumeOpen',1);
            isVolumeOpen='1';
        }
        isVolumeOpen=parseInt(isVolumeOpen);
        cc.log('isVolumeOpen',isVolumeOpen);
        globalsInfo.isVolumeOpen=isVolumeOpen;
        this.changeVolumeBg(isVolumeOpen);
        cc.log('globalsInfo.netstaus',window.netstaus);
        this.win.string=window.netstaus;
        var tip = this.tip;
        
        this.showCooldownMsg();
        
        //第一次启动
        cc.log('isStartUp:',globalsInfo.isStartUp);
        this.showAimation=1;
        this.checkBonus=1;
        if(globalsInfo.isStartUp===undefined){
            var loading = cc.instantiate(this.loadingPrefab);
            loading.setPosition(cc.p(0,50));
            this.node.addChild(loading,1,2000);
            
            //第一次启动让这两个进度条从0开始增加到指定值
            this.hpProgressBar.progress=0;
            this.totalProgressBar.progress=0;
            
            globalsInfo.isStartUp=1;
            this.checkBonus=0;
        }else{
            this.hpProgressBar.progress=globalsInfo.hpPercent!==undefined?globalsInfo.hpPercent:0;
            this.totalProgressBar.progress=globalsInfo.totalPercent!==undefined?globalsInfo.totalPercent:0;
            //做一个动画开关,1秒后播放掉血和每日任务进度条
            this.showAimation=0;
            
            this.scheduleOnce(function(){
                this.showAimation=1;
            },0.5);
        }
        var that = this;
        
        var userid = parseInt(cc.sys.localStorage.getItem('userid'));  
        var token = cc.sys.localStorage.getItem('token');
        var username = cc.sys.localStorage.getItem('username');
        
        globalsInfo.userid=userid;
        globalsInfo.token=token;
        globalsInfo.username=username;
        
        //var netInstance=null;
        var cbs = {
            onConnect:function(){
            
                cc.log('onconnect');
                //显示广告
                //显示公告
                //显示更新
                //that.win.string=-2;

                var isShowFightTip = cc.sys.localStorage.getItem('isShowFightTip');
                globalsInfo.isShowFightTip=isShowFightTip;

                if(!userid || userid.length===0){
                    cc.log('login');
                    cc.director.loadScene('login');
                }else{
                    
                    //验证登录是否过期
                    

                    cc.log('to verifyToken');
                    netInstance.emit('verifyToken', {});
                    //*
                    netInstance.onOneEventOneFunc('verifyToken', function(result){
                        console.log('verifyToken',JSON.stringify(result));
                        if(result.error){
                            cc.log("verifyToken: "+result.error);
                            //cc.director.loadScene('login');
                        }else{
                            cc.log('verifyToken success');
                            that.initVerifyOrRelogin(that);
                            
                            if(!that.node)
                                return;
                            that.node.removeChildByTag(2000);
                
                            
                        }
                    });
                    //*/
                }
            },
            onError:function(args) {
                cc.log('onError cb:',window.scenename);
                if(window.scenename==='login' || window.scenename==='register'){
                    cc.director.loadScene(window.scenename);
                }else if(window.scenename!=='main'){
                    cc.director.loadScene('main');
                }
                //*
                //that.node.removeChildByTag(2000);
                var toast = cc.instantiate(that.toastPrefab);
                toast.getComponent('toast').init('网络错误,请检查网络',3);
                that.node.addChild(toast,1);
                //*/
            },
            onClose:function(){
                cc.log('onClose cb:',window.scenename);
                //cc.director.loadScene('main');
                if(window.scenename!=='main'){
                    cc.director.loadScene('main');
                }
            },
            onNotValid:function(){
                cc.log('main onNotValid');
                //globalsInfo.netStatus=false;
                if(that.name!=='Canvas<main>'){
                    cc.director.loadScene('main');
                }else{
                    //that.onNotValid();
                }
                
            },
        };
        //重连加载数据,1.加载全局数据 2.本场景相关操作
        Network.setNetworkErrorHandler(cbs);
        netInstance = Network.getInstance(config.serverIp,config.serverPort,cbs);
        
        
        
        if(globalsInfo.isLogin){
            //重新登录的情况
            
            globalsInfo.isLogin=0;
            this.node.removeChildByTag(2000);
            
            this.initVerifyOrRelogin(this);
        }else{
            
            this.win.string= globalsInfo.win!==undefined?globalsInfo.win:0;
            this.draw.string=globalsInfo.draw!==undefined?globalsInfo.draw:0;
            this.lost.string=globalsInfo.lost!==undefined?globalsInfo.lost:0;
            var total = globalsInfo.total!==undefined?globalsInfo.total:0;
            this.total.string=total;
            
            //*
            if(globalsInfo.hp!==undefined){
                globalsInfo.hpPercent=globalsInfo.remainhp/globalsInfo.hp;
                this.hpValueLabel.string=globalsInfo.remainhp+"/"+globalsInfo.hp;
                
                globalsInfo.totalPercent=globalsInfo.todayamount/globalsInfo.todaytask;
                this.totalValueLabel.string=globalsInfo.todayamount+"/"+globalsInfo.todaytask;
            }
            this.username.string=username;
        }
        if(globalsInfo.isVolumeOpen)
            cc.audioEngine.playMusic(this.bgAudio, true);
           
        
        if(globalsInfo.bonus!==undefined){
            for(var bonusRecordId in globalsInfo.bonus){
                this.getBonus(bonusRecordId);
                break;
            }
        }
        if(globalsInfo.netStatus===false){
            //this.onNotValid();
        }
        this.initListener();
        
        var broadcast = cc.instantiate(this.broadcastPrefab);
        broadcast.getComponent('broadcast').init('worldbroadcastIndex',globalsInfo.worldMessges,function(datas){
            //每次循环后清理不在显示的信息
            //console.log(datas.shift());
            //bb.splice(2,1,'kk','gg');   从第2的下标开始删除1个数据，往第二个下标开始添加后面的数据
            var len = datas.length;
            cc.log('broadcast size:',globalsInfo.worldMessges.length);
            for(var i=0;i<len;){
                var data = datas[i];
                
                if(data.showtimes===0 || (data.showtimes===-1 && Utils.cmpDate(new Date(),new Date(data.etime))===1)){
                    console.log('remove broadcast:',data.showtimes,new Date(data.etime));
                    datas.splice(i,1);
                    len--;
                }else{
                    i++;
                }
            }
        });
        this.node.addChild(broadcast,1);
    },
    
    
    onNotValid:function(){
        var toast = cc.instantiate(this.toastPrefab);
        toast.getComponent('toast').init('网络错误,请检查网络',3);
        this.node.addChild(toast,1);
    },  
    //领奖励动画
    showBonus:function(bonusRecordId){
        var bonus = globalsInfo.bonus[bonusRecordId];
        this.showAimation=1;
        
        globalsInfo.remainhp+=bonus.items[0].num;
        globalsInfo.hpPercent=globalsInfo.remainhp/globalsInfo.hp;
        this.hpValueLabel.string=globalsInfo.remainhp+'/'+globalsInfo.hp;
        
        var that=this;
        var myBonusId=bonusRecordId;
        that.scheduleOnce(function(){
            console.log('scheduleOnce',myBonusId);
            delete globalsInfo.bonus[myBonusId];
            for(var bonusRecordId in globalsInfo.bonus){
                that.getBonus(bonusRecordId);
                break;
            }
        },1);
        
    },
    
    getBonus:function(bonusRecordId){
        var receive = cc.instantiate(this.receivePre);
        receive.setPosition(cc.p(0,0));
        var that = this;
        receive.getComponent('receiveBonus').init(globalsInfo.bonus[bonusRecordId],function(){
            netInstance.emit('receiveBonus', {'bonusRecordId':bonusRecordId});
            //loading
            var loading = cc.instantiate(that.loadingPrefab);
            //loading.setPosition(cc.p(0,0));
            that.node.addChild(loading,1,3000);
            
            netInstance.onOneEventOneFunc('receiveBonus',function(data){
                var bonusRecordId = data['bonusRecordId'];
                that.node.removeChildByTag(3000);
                that.node.removeChildByTag(2000);
                
                that.showBonus(bonusRecordId);
                
            });
        });
        this.node.addChild(receive,1,2000);
    },
    
    //重新登录或验证token成后初始化
    initVerifyOrRelogin:function(that){
        cc.log('initVerifyOrRelogin',JSON.stringify(globalsInfo));
        that.username.string=globalsInfo.username;
        //that.win.string=globalsInfo.win;
        that.draw.string=globalsInfo.draw;
        that.lost.string=globalsInfo.lost;
        that.total.string=globalsInfo.total;
        
        that.hpValueLabel.string=globalsInfo.remainhp+"/"+globalsInfo.hp;
        that.totalValueLabel.string=globalsInfo.todayamount+"/"+globalsInfo.todaytask;
        
        if(globalsInfo.todayamount>=globalsInfo.todaytask){
            that.finished.node.opacity=255;
        }
        
        netInstance.onOneEventOneFunc('worldMessageHistory', function(result){
            if(result.error){
                cc.log("worldMessageHistory: "+result.error);
            }else{
                var msgs = result.msgs;
                for(var i in msgs){
                    globalsInfo.worldMessges.push(msgs[i]);
                }
                cc.log('worldMessageHistory success',globalsInfo.worldMessges);
                
            }
        });
        netInstance.emit('worldMessageHistory', {});
    },
    
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this.showAimation===1)
            this._updateProgressBar(this.totalProgressBar,globalsInfo.totalPercent,dt);
        if(this.showAimation===1)
            this._updateProgressBar(this.hpProgressBar,globalsInfo.hpPercent,dt);
            
        this.setCooldownPercent();
    },
    
    _updateProgressBar: function(progressBar,percent,dt){
        var progress = progressBar.progress;
        if(progress < percent){
            if(globalsInfo.isStartUp===1)
                progress += dt;
            else
                progress+= dt/3;
            if(progress>percent){
                progress=percent;
                globalsInfo.isStartUp=2;
            }
            progressBar.progress = progress;
        }else if(progress>percent){
            progress -= dt/4;
            if(progress<percent)
                progress=percent;
            progressBar.progress = progress;
        }
    },
    searchOpponent:function(){
        if(this.isCooldown){
            var tip=this.tip;
            var loading = cc.instantiate(this.loadingPrefab);
            loading.setPosition(cc.p(0,50));
            this.node.addChild(loading,1,2000);
            
            cc.director.loadScene('mirrorFight');
            cc.audioEngine.stopMusic();
        }else{
            var toast = cc.instantiate(this.toastPrefab);
            toast.getComponent('toast').init('肌肉冷却中...\n良好的恢复能创造更好的成绩',3);
            this.node.addChild(toast,1);
        }
        /*
        var searchPre=cc.instantiate(this.searchPre);
        searchPre.setPosition(cc.p(0,0));
        this.node.addChild(searchPre,1,1000);
        
        var toast = cc.instantiate(this.toastPrefab);
        toast.getComponent('toast').init('全力以赴,是对对手的最大尊重!',3,cc.p(0,cc.winSize.height/4));
        this.node.addChild(toast,1,1001);
        
        var begin = new Date().getTime();
        var that = this;
        
        var netInstance = Network.getInstance();
        netInstance.onOneEventOneFunc('searchOpponent', function(result){
            if(result.error){
                //提示
                that.node.removeChildByTag(1000);
                if(result.errno==100){
                    //提示体力值不够
                    var toast = cc.instantiate(that.toastPrefab);
                    toast.getComponent('toast').init('体力值不足，赢了比赛才有体力奖励',3);
                    that.node.addChild(toast,1);
                }else if(result.errno==8001){
                    //网络错误
                    cc.log('newwork error fuck');
                    that.node.removeChildByTag(1000);
                    that.node.removeChildByTag(1001);
                    that.onNotValid();
                }else{
                    tip=result.error;
                }
            }else{
                globalsInfo.opponent = result;
                var now = new Date().getTime();
                var delta = now-begin;
                if(delta<2000){
                    that.scheduleOnce(function(){
                        that.node.removeChildByTag(1000);
                        
                        //处理web版第一次加载对战场景慢的问题
                        var loading = cc.instantiate(this.loadingPrefab);
                        loading.setPosition(cc.p(0,50));
                        that.node.addChild(loading,1,2000);
                        
                        cc.director.loadScene('mirrorFight');
                        cc.audioEngine.stopMusic();
                    },(2000-delta)/1000);
                }
            }
        });
        netInstance.emit('searchOpponent', {});
        */
    },
    rank:function(){

        var raceSize = globalsInfo.win+globalsInfo.draw+globalsInfo.lost;
        if(raceSize<3){
            var toast = cc.instantiate(this.toastPrefab);
            var remainSize = 3-raceSize;
            toast.getComponent('toast').init('再战'+remainSize+'次即可解锁排行榜\n战斗吧,勇士！',3);
            this.node.addChild(toast,1);
        }else{
            var loading = cc.instantiate(this.loadingPrefab);
            loading.setPosition(cc.p(0,50));
            this.node.addChild(loading,1,2000);
            cc.director.loadScene('rank');
        }
    },
    fightRecord:function(){
        var loading = cc.instantiate(this.loadingPrefab);
        loading.setPosition(cc.p(0,50));
        this.node.addChild(loading,1,2000);
        cc.director.loadScene('fightRecords');
    },
    volumeSetting:function(){

        //this.ws.send('restart test asdfasdf');
        cc.log('volumeSetting globalsInfo.netstaus',window.netstaus);
        this.win.string=window.netstaus;
        if(globalsInfo.isVolumeOpen==1){
            globalsInfo.isVolumeOpen=0;
            cc.sys.localStorage.setItem('isVolumeOpen',globalsInfo.isVolumeOpen);
            cc.audioEngine.stopMusic();
            this.changeVolumeBg(globalsInfo.isVolumeOpen);
            if(cc.sys.isNative)
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "login", "()V");
        }else{
            globalsInfo.isVolumeOpen=1;
            cc.sys.localStorage.setItem('isVolumeOpen',globalsInfo.isVolumeOpen);
            cc.audioEngine.playMusic(this.bgAudio, true);
            this.changeVolumeBg(globalsInfo.isVolumeOpen);
            if(cc.sys.isNative)
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "share", "()V");
        }
        //window.location.href="http://www.baidu.com";
        //window.open("http://www.baidu.com");
        //jsb.reflection.call
        //cc.log(this.reflection);
        
    },
    quit:function(){
        var setting = cc.instantiate(this.settingPre);
        setting.setPosition(cc.p(0,0));
        this.node.addChild(setting,1,2230);
        var that = this;
        setting.getComponent('setting').init({
            quit:function() {
                cc.sys.localStorage.removeItem('isVolumeOpen');
                cc.sys.localStorage.removeItem('userid');
                cc.sys.localStorage.removeItem('token');
                cc.sys.localStorage.removeItem('isShowFightTip');
                //cc.sys.localStorage.removeItem('username');
               
                that.node.removeChildByTag(2230);
                cc.director.loadScene('login');
            },
            confirm:function(){
                that.node.removeChildByTag(2230);
            },
        });
    },
    totalToast:function(){
        var toast = cc.instantiate(this.toastPrefab);
        toast.getComponent('toast').init('完成每日任务奖励3点体力值\n战斗吧,勇士！',3);
        this.node.addChild(toast,1);
    },
    hpToast:function(){
        var toast = cc.instantiate(this.toastPrefab);
        toast.getComponent('toast').init('1. 对战消耗一点体力值\n2. 赢一局奖励2点体力值\n3. 每天凌晨重置体力值',3);
        this.node.addChild(toast,1);
    },
});
