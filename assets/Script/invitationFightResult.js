cc.Class({
    extends: cc.Component,

    properties: {
        completeWin:{
            default:null,
            type:cc.Sprite,
            active:false,
            opacity:0,
        },
        win:{
            default:null,
            type:cc.Sprite,
            active:false,
            opacity:0,
        },
        narrowWin:{
            default:null,
            type:cc.Sprite,
            active:false,
            opacity:0,
        },
        draw:{
            default:null,
            type:cc.Sprite,
            active:false,
            opacity:0,
        },
        completeLose:{
            default:null,
            type:cc.Sprite,
            active:false,
            opacity:0,
        },
        lose:{
            default:null,
            type:cc.Sprite,
            active:false,
            opacity:0,
        },
        pityLose:{
            default:null,
            type:cc.Sprite,
            active:false,
            opacity:0,
        },
        winAudio:{
            default:null,
            url:cc.AudioClip
        },
        loseAudio:{
            default:null,
            url:cc.AudioClip
        },
        myScore:0,
        opponentScore:0,
        myScoreLabel:{
            default:null,
            type:cc.Label,
        },
        opponentScoreLabel:{
            default:null,
            type:cc.Label,
        },
    },
    init:function(myScore,opponentScore){
        cc.log('init',myScore,opponentScore);
        this.myScore=myScore;
        this.opponentScore=opponentScore;
    },
    
    /*
    start:function(){
        //*
        this.completeWin.node.active=false;
        this.win.node.active=false;
        this.narrowWin.node.active=false;
        this.completeLose.node.active=false;
        this.lose.node.active=false;
        this.pityLose.node.active=false;
        this.draw.node.active=false;
        
    },
    */
    // use this for initialization
    onLoad: function () {
        cc.log('fightresult onLoad');
        //*
        this.completeWin.node.opacity=0;
        this.win.node.opacity=0;
        this.narrowWin.node.opacity=0;
        this.completeLose.node.opacity=0;
        this.lose.node.opacity=0;
        this.pityLose.node.opacity=0;
        this.draw.node.opacity=0;
        //*/
        this.myScoreLabel.string=this.myScore;
        this.opponentScoreLabel.string=this.opponentScore;
        /*
        this.scheduleOnce(function(){
            this.narrowWin.node.opacity=255;
            this.narrowWin.node.runAction(cc.sequence(cc.scaleTo(0.6, 2, 2),cc.fadeOut(0.4),
            cc.callFunc(function(){
                cc.log('fightresult onload');
                //this.start1.node.opacity=1;  
                //this.game.gameStart();
            },this)));
        },0);
        
        //*/
        //*
        var delta=0;
        
        if(this.myScore>this.opponentScore){
            //播放动画
            cc.audioEngine.playEffect(this.winAudio);
            delta = this.myScore-this.opponentScore;
            if(delta<=3){
                //险胜
                this.narrowWin.node.active=true;
                this.narrowWin.node.opacity=255;
                this.narrowWin.node.runAction(cc.sequence(cc.scaleTo(1, 1.5, 1.5),
                cc.callFunc(function(){
                    cc.log('callFunc game narrowWin',this.game);   
                },this)));
            }else if(delta/this.opponentScore>=0.5){
                //完勝
                this.completeWin.node.opacity=255;
                this.completeWin.node.runAction(cc.sequence(cc.scaleTo(1, 1.5, 1.5),
                cc.callFunc(function(){
                    cc.log('callFunc game completeWin',this.game);   
                },this)));
            }else{
                //胜
                this.win.node.opacity=255;
                this.win.node.runAction(cc.sequence(cc.scaleTo(1, 1.5, 1.5),
                cc.callFunc(function(){
                    cc.log('callFunc game win',this.game);   
                },this)));
            }
        }else if (this.myScore<this.opponentScore){
            cc.audioEngine.playEffect(this.loseAudio);
            delta = this.opponentScore-this.myScore;
            cc.log('delta:', delta);
            cc.log('rate',delta/this.opponentScore);
            if(delta<=3){
                //惜败
                this.pityLose.node.opacity=255;
                this.pityLose.node.runAction(cc.sequence(cc.scaleTo(1, 1.5, 1.5),
                cc.callFunc(function(){
                    cc.log('callFunc game pityLose',this.game);   
                },this)));
            }else if(delta/this.opponentScore>=0.5){
                //惨败
                this.completeLose.node.opacity=255;
                this.completeLose.node.runAction(cc.sequence(cc.scaleTo(1, 1.5, 1.5),
                    cc.callFunc(function(){
                        cc.log('callFunc game completeLose',this.game);   
                    },this)));
            }else{
                //败
                this.lose.node.opacity=255;
                this.lose.node.runAction(cc.sequence(cc.scaleTo(1, 1.5, 1.5),
                cc.callFunc(function(){
                    cc.log('callFunc game lose',this.game);   
                },this)));
            }
        }else{
            this.draw.node.opacity=255;
            this.draw.node.runAction(cc.sequence(cc.scaleTo(1, 1.5, 1.5),
            cc.callFunc(function(){
                cc.log('callFunc game start',this.game);   
            },this)));
        }
        //*/
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
