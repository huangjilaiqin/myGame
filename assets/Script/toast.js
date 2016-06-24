cc.Class({
    extends: cc.Component,

    properties: {
        msg:{
            default:null,
            type:cc.Label,
        },
        screen:{
            default:null,
            type:cc.Sprite,
        },
        duration:{
            default:2.5,
            visible:false,
        }
    },
    init:function(info,duration){
        this.msg.string=info;
        cc.log(duration);
        if(duration!==undefined)
            this.duration=duration;
    },
    // use this for initialization
    onLoad: function () {
        this.node.setPosition(cc.p(0,0));
        
        var scaleAction = cc.scaleTo(0.2, 1, 1);
        scaleAction.easing(cc.easeBackOut());
        this.node.scale=0;
        this.node.runAction(cc.sequence(scaleAction));
        this.scheduleOnce(function(){
             var fadeAction = cc.fadeOut(0.2);
             var moveAction =cc.moveBy(0.2, 0, 50);
             this.node.runAction(cc.spawn(fadeAction,moveAction));
        },this.duration);
        
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        /*
        if(this.screen.node.opacity<130)
            this.screen.node.opacity+=dt*130;
            */
    },
});
