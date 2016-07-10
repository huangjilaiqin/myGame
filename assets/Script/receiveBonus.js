cc.Class({
    extends: cc.Component,

    properties: {
        goodnum:{
            default:null,
            type:cc.Label,
        },
        goodimg:{
            default:null,
            type:cc.Sprite,
        },
        goodname:{
            default:null,
            type:cc.Label,
        },
        screen:{
            default:null,
            type:cc.Sprite,
        },
        title:{
            default:null,
            type:cc.Label,
        },
        reason:{
            default:null,
            type:cc.Label,
        },
        callback:{
            default:null,
            visible:false,
        },
        bonus:{
            default:null,
            visible:false,
        },
    },
    init:function(bonus,callback){
        this.callback=callback;
        this.bonus=bonus;
        cc.log(bonus);
    },
    receiveBonus:function(){
        this.callback();
    },
    // use this for initialization
    onLoad: function () {
        
        this.title.string=this.bonus.bonusname;
        this.reason.string=this.bonus.reason+"将获得以下奖励:";
        cc.log(this.bonus);
        var item = this.bonus.items[0];
        this.goodname.string=item.goodname;
        this.goodnum.string='x'+item.num;
        
        this.node.setPosition(cc.p(0,0));
        
        var scaleAction = cc.scaleTo(0.2, 1, 1);
        scaleAction.easing(cc.easeBackOut());
        this.node.scale=0;
        this.node.runAction(cc.sequence(scaleAction));
        
        /*
        this.scheduleOnce(function(){
             var fadeAction = cc.fadeOut(0.2);
             var moveAction =cc.moveBy(0.2, 0, 50);
             this.node.runAction(cc.spawn(fadeAction,moveAction));
        },this.duration);
        */
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        /*
        if(this.screen.node.opacity<130)
            this.screen.node.opacity+=dt*130;
            */
    },
});
