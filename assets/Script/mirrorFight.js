const Network = require('Network');
const globalsInfo = require('globalsInfo');

cc.Class({
    extends: cc.Component,
    
    properties: {
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
        //0:未开始,1:进行中,2:暂停,3:结束
        gameStatus:0,
        opponentInfo:null,
        opponentIndex:0,
        opponentCallbackWork:0,
        isOpponentOver:0,
    },
    gameOver:function(){
        cc.log('gameover');
    },
    ticktack:function(){
        this.countdownTime--;
        if(this.countdownTime==3){
            cc.log(this.countdown.node);
            this.countdown.node.color = new cc.Color(255,0,0,1);
            //cc.log(this.countdown.font);
            //this.countdown.font.color = new cc.Color(255,0,0,1);
        }else if(this.countdownTime===0){
            this.gamestatus=4;
            this.gameOver();
        }
        this.countdown.string=this.countdownTime;
    },
    
    onLoad: function () {
        cc.log(globalsInfo.opponent);
        this.opponentInfo = globalsInfo.opponent;
        this.opponentName.string=this.opponentInfo.username;
        //设置点击事件
        //this.node.on(cc.Node.EventType.TOUCH_START,this.myPushup,this);
        this.node.on(cc.Node.EventType.TOUCH_START,this.myPushup.bind(this));
        //this.node.on.apply(this,cc.Node.EventType.TOUCH_START,this.myPushup);
        //倒计时
        this.schedule(this.ticktack,1,this.countdownTime-1,1);
        //设置对手回调
        this.gamestatus=1;
        //this.scheduleOnce(this.opponentPushup,this.opponentInfo.records[this.opponentIndex++]);
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
        /*
        if(this.gamestatus===1 && this.opponentCallbackWork===0){
            if(this.opponentIndex<this.opponentInfo.records.length){
                this.scheduleOnce(this.opponentPushup,this.opponentInfo.records[this.opponentIndex++]);
                this.opponentCallbackWork=1;
            }
        }
        //*/
    },
});
