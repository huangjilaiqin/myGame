const Network = require('Network');
const globalsInfo = require('globalsInfo');
const config = require('config');

cc.Class({
    extends: cc.Component,
    
    properties: {
        start_countdown: {
            default: null,
            type: cc.Prefab
        },
        invitationFightResult: {
            default: null,
            type: cc.Prefab
        },
        myCountScorePre: {
            default: null,
            type: cc.Prefab
        },
        dialogPre: {
            default: null,
            type: cc.Prefab
        },
        loadingPrefab: {
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
        //*
        this.node.removeChildByTag(1002);
        this.node.removeChildByTag(1001);
        var fx = cc.instantiate(this.invitationFightResult);
        var tt = fx.getComponent('invitationFightResult');
        tt.init(this.myCountScore.getScore(),this.opponentCountScore.getScore());
        fx.setPosition(cc.p(0,0));
        this.node.addChild(fx);

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
        fx1.setPosition(cc.p(-55,0));
        this.myCountScore = fx1.getComponent('countScore');
        
        var fx2 = cc.instantiate(this.opponentCountScorePre);
        this.node.addChild(fx2,1,1001);
        fx2.setPosition(cc.p(55,0));
        this.opponentCountScore = fx2.getComponent('countScore');
    },
    ticktack:function(){
        this.countdownTime--;
        if(this.countdownTime==3){
            cc.log(this.countdown.node);
            this.countdown.node.color = new cc.Color(255,0,0,1);
            //cc.log(this.countdown.font);
            //this.countdown.font.color = new cc.Color(255,0,0,1);
        }else if(this.countdownTime===0){
            this.gameStatus++;
            if(this.gameStatus===3)
                this.gameOver();
        }
        this.countdown.string=this.countdownTime;
    },
    
    onLoad: function () {

        var userid=1;
        var recordid=30;
        if (!cc.sys.isNative) {
            cc.log('main onLoad',location);
            if(location.search.length===0){
                cc.log('search is undefined');
            }
        }else{
            return;
        }
        this.myName.string='本少侠';
        //总时间
        this.countdown.string=this.countdownTime;

        var that = this;
        //转圈圈
        var loading = cc.instantiate(this.loadingPrefab);
        loading.setPosition(cc.p(0,50));
        this.node.addChild(loading,1,2000);

        var netInstance = Network.getInstance(config.serverIp,config.serverPort,function(){
            netInstance.emit('record', {'recordid':recordid});
            netInstance.onOneEventOneFunc('record',function(obj){
                that.node.removeChildByTag(2000);

                that.opponentInfo = obj;
                cc.log(that.opponentInfo);  
                
                that.opponentName.string=that.opponentInfo.username;
                that.opponentRecordsSize=that.opponentInfo.record.length;
                that.opponentNextTime=that.opponentInfo.record[that.opponentIndex];
                cc.log(that.opponentIndex,that.opponentInfo.record);
                cc.log('opponentNextTime',that.opponentNextTime);
                var dialogPre = cc.instantiate(that.dialogPre);
                dialogPre.setPosition(cc.p(0,50));
                that.node.addChild(dialogPre,1,3000);
                var dialog = dialogPre.getComponent('dialog');
                dialog.init("1.请将手机平放在地上\n2.用下巴或鼻子触摸屏幕\n\n为了荣誉，战斗吧！",function(){
                    that.node.removeChildByTag(3000);
                    that.startCountDown();
                });
            });
        });
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
            cc.log('delta',now-this.lastPushupTime);
            return;
        }        
        this.lastPushupTime=now;
        this.myCountScore.add();
        if(globalsInfo.isVolumeOpen)
            cc.audioEngine.playMusic(this.myPushupAudio);
    },
    opponentPushup:function(){
        this.opponentCountScore.add();
        this.opponentCallbackWork=0;
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
                    this.opponentNextTime=this.opponentInfo.record[this.opponentIndex];
                }
            }
        }
        //*/
    },
});
