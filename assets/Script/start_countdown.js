cc.Class({
    extends: cc.Component,

    properties: {
        start3:{
            default:null,
            type:cc.Sprite,
        },
        start2:{
            default:null,
            type:cc.Sprite,
        },
        start1:{
            default:null,
            type:cc.Sprite,
        },
        readygoAudio:{
            default:null,
            url:cc.AudioClip
        },
        game:null,
    },
    init:function(game){
        this.game=game;
        cc.log('countdown init');
    },
    // use this for initialization
    onLoad: function () {
        this.start3.node.active=false;
        this.start2.node.active=false;
        this.start1.node.active=false;
        this.scheduleOnce(function(){
            this.start3.node.active=true;
            this.start3.node.runAction(cc.sequence(cc.scaleTo(0.6, 2, 2),cc.fadeOut(0.4)));
        },0);
        this.scheduleOnce(function(){
            this.start2.node.active=true;
            this.start2.node.runAction(cc.sequence(cc.scaleTo(0.6, 2, 2),cc.fadeOut(0.4)));
            cc.audioEngine.playEffect(this.readygoAudio);
        },1);
        var game = this.game;
        this.scheduleOnce(function(){
            this.start1.node.active=true;
            this.start1.node.runAction(cc.sequence(cc.scaleTo(0.6, 2, 2),cc.fadeOut(0.4),
            cc.callFunc(function(){
                cc.log('callFunc game start',this.game);    
                this.game.gameStart();
            },this)));
        },2);
    },
    

    /*
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
    },
    */
});
