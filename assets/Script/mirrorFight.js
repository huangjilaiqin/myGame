const Network = require('Network');
const globalsInfo = require('globalsInfo');

cc.Class({
    extends: cc.Component,
    
    properties: {
        start_countdown: {
            default: null,
            type: cc.Prefab
        },
        fightResult: {
            default: null,
            type: cc.Prefab
        },
        numtest:{
            default: null,
            type: cc.Prefab
        },
        myName:{
            default:null,
            type:cc.Label,
        },
        myScoreLabel:{
            default:null,
            type:cc.Label,
        },
        opponentScoreLabel:{
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
        
        myScore:0,
        opponentScore:0,
        countdownTime:6,
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
    },
    gameOver:function(){
        cc.log('gameover');
        //*
        var fx = cc.instantiate(this.fightResult);
        var tt = fx.getComponent('fightResult');
        tt.init(this.myScore,this.opponentScore);
        fx.setPosition(cc.p(0,0));
        this.node.addChild(fx);
        //*/
        /*
        var fx = cc.instantiate(this.start_countdown);
        this.node.addChild(fx);
        fx.setPosition(cc.p(0,0));
        var tt = fx.getComponent('start_countdown');
        tt.init(this);
        //*/
    },
    
    gameStart:function(){
        //开始
        this.gameStatus=1;
        this.oppponentStatus=1;
        
        //倒计时
        this.schedule(this.ticktack,1,this.countdownTime-1,1);
        
        //设置点击事件
        //this.node.on(cc.Node.EventType.TOUCH_START,this.myPushup,this);
        this.node.on(cc.Node.EventType.TOUCH_START,this.myPushup.bind(this));
        
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
        
        cc.log(globalsInfo.opponent);
        this.opponentInfo = globalsInfo.opponent;
        
        this.opponentName.string='testName';
        /*
        这里有问题
        this.opponentName.string=this.opponentInfo.username;
        
        this.opponentRecordsSize=this.opponentInfo.records.length;
        this.opponentNextTime=this.opponentInfo.records[this.opponentIndex++];
        
        
        var fx = cc.instantiate(this.start_countdown);
        this.node.addChild(fx);
        fx.setPosition(cc.p(0,0));
        var tt = fx.getComponent('start_countdown');
        tt.init(this);
        */
    },
    myPushup:function(){
        if(this.countdownTime===0)
            return;
        this.myScore++;
        this.myScoreLabel.string=this.myScore;
    },
    opponentPushup:function(){
        this.opponentScore++;
        this.opponentScoreLabel.string=this.opponentScore;
        //this.unschedule(this.opponentPushup);
        this.opponentCallbackWork=0;
    },
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        //在游戏中,且对手没有完
        /*
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
        */
    },
});
