cc.Class({
    extends: cc.Component,

    properties: {
        xposition:{
            default:0,
        },
        yposition:{
            default:0,
        },
        loadingImg:{
            default:null,
            type:cc.Sprite,
        },
    },

    // use this for initialization
    onLoad: function () {
        cc.log('loading onload');
        this.node.setPosition(cc.p(this.xposition,this.yposition));
        this.loadingImg.node.runAction(cc.repeatForever(cc.rotateBy(0.8,360)));
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
