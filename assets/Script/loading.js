cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // use this for initialization
    onLoad: function () {
        cc.log('loading onload');
        this.node.runAction(cc.repeatForever(cc.rotateBy(0.8,360)));
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
