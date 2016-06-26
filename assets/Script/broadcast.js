cc.Class({
    extends: cc.Component,

    properties: {
        msg1:{
            default:null,
            type:cc.Label,
        },
        msg2:{
            default:null,
            type:cc.Label,
        },
        msg3:{
            default:null,
            type:cc.Label,
        },
        datas:{
            default:null,
            visible:false,
        },
    },
    
    getRandNumber:function(){
        //return 40+250*Math.random();
        return 40;
    },

    // use this for initialization
    onLoad: function () {
        var screenWidth = cc.winSize.width;
        var screenHeight = cc.winSize.height;
        cc.log(screenHeight/2-this.getRandNumber());
        this.msg1.node.setPosition(screenWidth/2,screenHeight/2-32);
        var that = this;
        var scaleAction = cc.scaleTo(2,2,2);
        var moveAction = cc.moveBy(5,-(screenWidth+300),0);
        this.msg1.node.runAction(cc.sequence(moveAction));
        /*
        this.msg2.node.setPosition(0,screenHeight-this.getRandNumber());
        this.msg3.node.setPosition(0,screenHeight-this.getRandNumber());
        */
    },
    msgMove:function(node){
        node.x=,screenWidth/2;
        var moveAction = cc.moveBy(5,-(screenWidth+300),0);
        this.msg1.node.runAction(cc.sequence(moveAction));
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
