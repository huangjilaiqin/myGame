const globalsInfo = require('globalsInfo');
cc.Class({
    extends: cc.Component,

    properties: {
        start3:{
            default:null,
            type:cc.Sprite,
            active:false,
        },
        start2:{
            default:null,
            type:cc.Sprite,
            active:false,
        },
        start1:{
            default:null,
            type:cc.Sprite,
            active:false,
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
    start:function(){
        this.start3.node.active=false;
        this.start2.node.active=false;
        this.start1.node.active=false;
        cc.log('countdown start');
    },
    // use this for initialization
    onLoad: function () {
        
        //*
        this.scheduleOnce(function(){
            this.start3.node.active=true;
            this.start3.node.runAction(cc.sequence(cc.scaleTo(0.6, 2, 2),cc.fadeOut(0.4),cc.callFunc(function(){
                    this.start3.node.opacity=0;
                    this.start3.node.active=false;
                    
                    this.start2.node.active=true;
                    if(globalsInfo.isVolumeOpen)
                        cc.audioEngine.playEffect(this.readygoAudio);
                    this.start2.node.runAction(cc.sequence(cc.scaleTo(0.6, 2, 2),cc.fadeOut(0.4),cc.callFunc(function(){
                        cc.log('fock');
                        this.start1.node.active=true;
                        this.start1.node.runAction(cc.sequence(cc.scaleTo(0.6, 2, 2),cc.fadeOut(0.4),cc.callFunc(function(){
                            this.start1.node.opacity=1;  
                            this.game.gameStart();
                        },this)));
                    },this)));
                },this)));
        },0);
        //*/
    },
    

    /*
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
    },
    */
});
