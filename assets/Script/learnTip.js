cc.Class({
    extends: cc.Component,

    properties: {
        title:{
            default:null,
            type:cc.Label,
        },
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
        dialog:{
            default:null,
            type:cc.Node,
        },
    },
    confirm:function(){
        this.confirmCallback();
    },
    init:function(title,info,callback){
        this.title.string=title;
        this.msg.string=info;
        this.confirmCallback=callback;
    },
    // use this for initialization
    onLoad: function () {
        cc.log('learnTip onLoad');
        var screenHeight = cc.winSize.height;
        var dialogHeight = this.node.height;
        cc.log('screenHeight',screenHeight);
        cc.log('dialogHeight',dialogHeight);
        //动画
        var moveHeight=screenHeight/2;
        this.node.setPosition(cc.p(0,moveHeight));
        //*
        var moveAction = cc.moveBy(1,0,-(screenHeight/2+dialogHeight/2));
        moveAction.easing(cc.easeBounceOut(3));
        
        this.node.runAction(cc.sequence(moveAction));
        //*/
        cc.log('animation');
        
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this.screen.node.opacity<130)
            this.screen.node.opacity+=dt*130;
    },
});
