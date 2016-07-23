const Network = require('Network');
const globalsInfo = require('globalsInfo');

cc.Class({
    extends: cc.Component,
    
    properties: {
        start_countdown: {
            default: null,
            type: cc.Prefab,
        },
        fightResult: {
            default: null,
            type: cc.Prefab,
        },
        myCountScorePre: {
            default: null,
            type: cc.Prefab,
        },
        dialogPre: {
            default: null,
            type: cc.Prefab,
        },
        learnTipPre: {
            default: null,
            type: cc.Prefab,
        },
        searchPre: {
            default: null,
            type: cc.Prefab
        },
        myCountScore:{
            default:null,
            visible:false,
        },
        opponentCountScorePre: {
            default: null,
            type: cc.Prefab
        },
        opponentCountScore:{
            default:null,
            visible:false,
        },
        myName:{
            default:null,
            type:cc.Label,
        },
        opponentName:{
            default:null,
            type:cc.Label,
        },
        countdown:{
            default:null,
            type:cc.Label,
        },
        myPushupAudio:{
            default:null,
            url:cc.AudioClip
        },
        opponentPushupAudio:{
            default:null,
            url:cc.AudioClip
        },
        ticktackAudio:{
            default:null,
            url:cc.AudioClip
        },
        toastPrefab: {
            default: null,
            type: cc.Prefab
        },
        timefg:{
            default:null,
            type:cc.Sprite,
        },
        
        countdownTime:30,
        //0:未开始,1:进行中,2:有一个人完成,3:两个人都完成
        gameStatus:0,
        opponentInfo:null,
        opponentIndex:0,
        opponentRecordsSize:0,
        opponentCallbackWork:0,
        //0:未开始,1:进行中,2:暂停,3:结束
        opponentStatus:0,
        opponentNextTime:0,
        //opponent 在update中累计的时间
        opponentUpdateTime:0,
        //我上次做俯卧撑的时间
        lastPushupTime:{
            default:0,
            visible:false,
        }
    },
    gameOver:function(){
        cc.log('gameover');
        cc.log('stop ticktack');
        cc.audioEngine.stopMusic(this.ticktackAudio);
        //*
        this.node.removeChildByTag(1002);
        this.node.removeChildByTag(1001);
        var fx = cc.instantiate(this.fightResult);
        var tt = fx.getComponent('fightResult');
        tt.init(this.myCountScore.getScore(),this.opponentCountScore.getScore());
        fx.setPosition(cc.p(0,0));
        this.node.addChild(fx);
        
        var records = this.myCountScore.getRecords();
        var netInstance = Network.getInstance();
        var userid = globalsInfo.userid;
        var token = globalsInfo.token;
        var opponentId = this.opponentInfo.userid;
        var requestObj = {
            'opponentId':opponentId,
            'oRecordId':this.opponentInfo.id,
            'oRecordSize':this.opponentRecordsSize,
            'records':records,
        };
        netInstance.emit('uploadRecord', requestObj);
        var that = this;
        netInstance.onOneEventOneFunc('uploadRecord', function(result){
            //var result = JSON.parse(obj);
            if(result.error){
                //提示
                cc.log("uploadRecord error: "+result);
            }else{
                cc.log('uploadRecord success',result);
                globalsInfo.value=result.value;
                globalsInfo.total=result.total;
                globalsInfo.win=result.win;
                globalsInfo.draw=result.draw;
                globalsInfo.lost=result.lost;
                globalsInfo.todaytask=result.todaytask;
                globalsInfo.todayamount=result.todayamount;
                globalsInfo.remainhp=result.remainhp;
                globalsInfo.hp=result.hp;
                globalsInfo.lastfighttime=result.lastfighttime;
                cc.sys.localStorage.setItem('lastfighttime',globalsInfo.lastfighttime);
                if(result.encourageMsg.length>0){
                    var toast = cc.instantiate(that.toastPrefab);
                    toast.getComponent('toast').init(result.encourageMsg,4,cc.p(0,cc.winSize.height/4));
                    that.node.addChild(toast,1);
                }
            }
        });
    },
    
    gameStart:function(){
        //开始
        this.gameStatus=1;
        this.oppponentStatus=1;
        
        //倒计时
        this.schedule(this.ticktack,1,this.countdownTime-1,1);
        
        //设置点击事件
        //this.node.on(cc.Node.EventType.TOUCH_START,this.myPushup,this);
        this.node.on(cc.Node.EventType.TOUCH_END,this.myPushup.bind(this));
        
        var fx1 = cc.instantiate(this.myCountScorePre);
        this.node.addChild(fx1,1,1002);
        fx1.setPosition(cc.p(-100,0));
        this.myCountScore = fx1.getComponent('countScore');
        
        var fx2 = cc.instantiate(this.opponentCountScorePre);
        this.node.addChild(fx2,1,1001);
        fx2.setPosition(cc.p(100,0));
        this.opponentCountScore = fx2.getComponent('countScore');
    },
    ticktack:function(){
        this.countdownTime--;
        if(this.countdownTime==5){
            this.countdown.node.color = new cc.Color(255,0,0,1);
            cc.log('begin ticktack');
            if(globalsInfo.isVolumeOpen)
                this.ticktackAudioId = cc.audioEngine.playMusic(this.ticktackAudio,true);
            //cc.log(this.countdown.font);
            //this.countdown.font.color = new cc.Color(255,0,0,1);
        }else if(this.countdownTime===0){
            this.gameStatus++;
            if(this.gameStatus===3){
                
                this.gameOver();
            }
        }
        this.countdown.string=this.countdownTime;
    },
    searchOpponent:function(){
        var tip=this.tip;
        
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
                        /*
                        var loading = cc.instantiate(this.loadingPrefab);
                        loading.setPosition(cc.p(0,50));
                        that.node.addChild(loading,1,2000);
                        cc.director.loadScene('mirrorFight');
                        cc.audioEngine.stopMusic();
                        */
                        that.node.removeChildByTag(1000);
                        that.node.removeChildByTag(1001);
                        that.initFight();
                    },(2000-delta)/1000);
                }
            }
        });
        netInstance.emit('searchOpponent', {});
    },
    onLoad: function () {
        window.scenename='mirrorFight';
        this.fightTime=0;
        this.searchOpponent();
    },
    initFight:function(){
        cc.log(globalsInfo.opponent);
        this.myName.string=globalsInfo.username;
        this.opponentInfo = globalsInfo.opponent;
        
        this.opponentName.string='瑟瑟饿发抖';
        
        this.countdown.string=this.countdownTime;
        //*
        this.opponentName.string=this.opponentInfo.username;
        
        this.opponentRecordsSize=this.opponentInfo.records.length;
        cc.log('opponentRecordsSize:',this.opponentRecordsSize);
        this.opponentNextTime=this.opponentInfo.records[this.opponentIndex];
        
        if(globalsInfo.isShowFightTip!=1){
           //*
            var learnTipPre = cc.instantiate(this.learnTipPre);
            
            this.node.addChild(learnTipPre,1,3000);
            var learnTip = learnTipPre.getComponent('learnTip');
            var that = this;
            learnTip.init("俯卧撑学院","1. 请将手机平放在地上\n2. 用下巴或鼻子触摸屏幕\n\n为了荣誉，战斗吧！",function(){
                that.node.removeChildByTag(3000);
                that.startCountDown();
                globalsInfo.isShowFightTip=1;
                cc.sys.localStorage.setItem('isShowFightTip',1);
            });
            //*/
            
            
        }else{
            this.startCountDown();
        }
    },
    startCountDown:function(){
        var fx = cc.instantiate(this.start_countdown);
        this.node.addChild(fx);
        fx.setPosition(cc.p(0,0));
        var tt = fx.getComponent('start_countdown');
        tt.init(this);
    },
    myPushup:function(){
        if(this.countdownTime===0)
            return;
        var now = new Date().getTime();
        if(now-this.lastPushupTime<350){
            //cc.log('delta',now-this.lastPushupTime);
            var toast = cc.instantiate(this.toastPrefab);
            toast.getComponent('toast').init('您已接近吉尼斯记录了,悠着点!',3,cc.p(0,cc.winSize.height/4));
            this.node.addChild(toast,1);
            return;
        }
        this.lastPushupTime=now;
        this.myCountScore.add();
        if(globalsInfo.isVolumeOpen)
            cc.audioEngine.playEffect(this.myPushupAudio);
    },
    opponentPushup:function(){
        this.opponentCountScore.add();
        this.opponentCallbackWork=0;
        cc.log('globalsInfo.isVolumeOpen',globalsInfo.isVolumeOpen);
        if(globalsInfo.isVolumeOpen)
            cc.audioEngine.playEffect(this.opponentPushupAudio);
    },
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        //在游戏中,且对手没有完
        //*
        if(this.oppponentStatus===1){
            this.opponentUpdateTime+=dt;
            
            if(this.opponentUpdateTime>=this.opponentNextTime){
                cc.log(this.opponentUpdateTime,this.opponentNextTime);
                this.opponentPushup();
                //重新计时准备下一次调用,把多出来的时间计入到下一轮减少误差
                this.opponentUpdateTime=this.opponentUpdateTime-this.opponentNextTime;
                this.opponentIndex++;
                
                if(this.opponentIndex===this.opponentRecordsSize){
                    this.oppponentStatus=3;
                    this.gameStatus++;
                    if(this.gameStatus===3)
                        this.gameOver();
                }else{
                    this.opponentNextTime=this.opponentInfo.records[this.opponentIndex];
                }
            }
        }
        if(this.gameStatus>0){
            if(this.fightTime+dt>30)
                this.fightTime=30;
            else
                this.fightTime += dt;
            this.timefg.fillStart = this.fightTime/30;
        }
        //*/
    },
});
