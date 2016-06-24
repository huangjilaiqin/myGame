cc.Class({
    extends: cc.Component,

    properties: {
        msg:{
            default:null,
            type:cc.Label,
        },
        confirmCallback:{
            default:null,
            visible:false,
        },
        screen:{
            default:null,
            type:cc.Sprite,
        },
    },
    confirm:function(){
        this.confirmCallback();
    },
    init:function(info,callback){
        this.msg.string=info;
        this.confirmCallback=callback;
    },
    // use this for initialization
    onLoad: function () {
        
        var screenHeight = cc.winSize.height;
        var dialogHeight = this.node.height;
        //动画
        var moveHeight=screenHeight/2;
        this.node.setPosition(cc.p(0,moveHeight));
        //*
        var moveAction = cc.moveBy(1,0,-(screenHeight/2+dialogHeight/2));
        moveAction.easing(cc.easeBounceOut(3));
        this.node.runAction(cc.sequence(moveAction));
        //*/
        
        
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this.screen.node.opacity<130)
            this.screen.node.opacity+=dt*130;
    },
});
