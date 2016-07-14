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
        tip:{
            default:null,
            type:cc.Label,
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
    // use this for initialization
    onLoad: function () {
        
        //界面动效
        this.initAction();
        
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
                            /*
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
                            //*/
                            //tip=token;
                            
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
                cc.log('onError main');
                that.node.removeChildByTag(2000);
                var toast = cc.instantiate(that.toastPrefab);
                toast.getComponent('toast').init('网络错误,请检查网络',3);
                that.node.addChild(toast,1);
            },
            onClose:function(){
                cc.log('main onClose');
                //cc.director.loadScene('main');
            },
            onNotValid:function(){
                //globalsInfo.netStatus=false;
                cc.director.loadScene('main');
            },
        };
        //重连加载数据,1.加载全局数据 2.本场景相关操作
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
            this.onNotValid();
        }
        this.initListener();
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
            //var netInstance = Network.getInstance();
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
        //var netInstance = Network.getInstance();
        that.username.string=globalsInfo.username;
        //that.win.string=globalsInfo.win;
        that.draw.string=globalsInfo.draw;
        that.lost.string=globalsInfo.lost;
        that.total.string=globalsInfo.total;
        
        that.hpValueLabel.string=globalsInfo.remainhp+"/"+globalsInfo.hp;
        that.totalValueLabel.string=globalsInfo.todayamount+"/"+globalsInfo.todaytask;
    },
    
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this.showAimation===1)
            this._updateProgressBar(this.totalProgressBar,globalsInfo.totalPercent,dt);
        if(this.showAimation===1)
            this._updateProgressBar(this.hpProgressBar,globalsInfo.hpPercent,dt);
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
        //var netInstance = Network.getInstance();
        var tip=this.tip;
        
        var searchPre=cc.instantiate(this.searchPre);
        searchPre.setPosition(cc.p(0,0));
        this.node.addChild(searchPre,1,1000);
        
        var begin = new Date().getTime();
        var that = this;
        netInstance.emit('searchOpponent', {});
        netInstance.onOneEventOneFunc('searchOpponent', function(result){
            if(result.error){
                //提示
                that.node.removeChildByTag(1000);
                if(result.errno==100){
                    //提示体力值不够
                    var toast = cc.instantiate(that.toastPrefab);
                    toast.getComponent('toast').init('体力值不足，请完成今日任务,赚取体力值',3);
                    that.node.addChild(toast,1);
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
        }else{
            globalsInfo.isVolumeOpen=1;
            cc.sys.localStorage.setItem('isVolumeOpen',globalsInfo.isVolumeOpen);
            cc.audioEngine.playMusic(this.bgAudio, true);
            this.changeVolumeBg(globalsInfo.isVolumeOpen);
        }
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
