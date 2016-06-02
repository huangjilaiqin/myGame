cc.Class({
    extends: cc.Component,

    properties: {
        completeWin:{
            default:null,
            type:cc.Sprite,
        },
        win:{
            default:null,
            type:cc.Sprite,
        },
        narrowWin:{
            default:null,
            type:cc.Sprite,
        },
        draw:{
            default:null,
            type:cc.Sprite,
        },
        completeLose:{
            default:null,
            type:cc.Sprite,
        },
        lose:{
            default:null,
            type:cc.Sprite,
        },
        pityLose:{
            default:null,
            type:cc.Sprite,
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
    },
    init:function(myScore,opponentScore){
        this.myScore=myScore;
        this.opponentScore=opponentScore;
    },
    // use this for initialization
    onLoad: function () {
        this.completeWin.node.active=false;
        this.win.node.active=false;
        this.narrowWin.node.active=false;
        this.completeLose.node.active=false;
        this.lose.node.active=false;
        this.pityLose.node.active=false;
        this.draw.node.active=false;
        
        var delta=0;
        if(this.myScore>this.opponentSocre){
            //播放动画
            cc.audioEngine.playEffect(this.winAudio);
            delta = this.myScore-this.opponentSocre;
            var sprite=null;
            if(delta<=3){
                //险胜
                sprite = new cc.Sprite(res.narrowwin_png);
            }else if(delta/this.opponentSocre>=0.5){
                //完勝
                sprite = new cc.Sprite(res.completewin_png);
            }else{
                //胜
                sprite = new cc.Sprite(res.win_png);
            }
            sprite.setPosition(centerPoint);
            this.addChild(sprite, 0);
            sprite.runAction(cc.Sequence.create(cc.ScaleTo.create(0.6, 2, 2)));
        }else if (this.myScore<this.opponentSocre){
            cc.audioEngine.playEffect(this.loseAudio);
            delta = this.opponentSocre-this.myScore;
            sprite=null;
            if(delta<=3){
                //惜败
                sprite = new cc.Sprite(res.pitylose_png);
            }else if(delta/opponentSocre>=0.5){
                //惨败
                sprite = new cc.Sprite(res.completelose_png);
            }else{
                //败
                sprite = new cc.Sprite(res.lose_png);
            }
            sprite.setPosition(centerPoint)
            this.addChild(sprite, 0);
            sprite.runAction(cc.Sequence.create(cc.ScaleTo.create(0.6, 2, 2)));
        }else{
            var sprite= new cc.Sprite(res.draw_png);
            sprite.setPosition(centerPoint)
            this.addChild(sprite, 0);
            sprite.runAction(cc.Sequence.create(cc.ScaleTo.create(0.6, 2, 2)));
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
