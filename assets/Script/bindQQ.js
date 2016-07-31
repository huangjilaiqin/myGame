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
        this.screen.node.opacity=130;

        var screenHeight = cc.winSize.height;
        var dialogHeight = this.node.height;
        //动画
        var moveHeight=screenHeight/2+dialogHeight/2;
        //setPosition不起作用了,可能跟设置widget边界百分比有关,所以使用移动来代替
        this.node.setPosition(cc.p(0,moveHeight));

        var beforeAction = cc.moveBy(0,0,moveHeight);

        var moveAction = cc.moveBy(1,0,-(screenHeight/2+dialogHeight/2));
        moveAction.easing(cc.easeBounceOut(3));
        
        this.node.runAction(cc.sequence(beforeAction,moveAction));
        
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        /*
        if(this.screen.node.opacity<130)
            this.screen.node.opacity+=dt*130;
        */
    },
});
