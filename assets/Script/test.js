cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        broadcastPre: {
            default: null,
            type: cc.Prefab
        },
        receivePre:{
            default: null,
            type: cc.Prefab
        },
    },

    // use this for initialization
    onLoad: function () {
        /*
        var broadcast = cc.instantiate(this.broadcastPre);
        broadcast.setPosition(cc.p(0,0));
        this.node.addChild(broadcast,1);
        */
        var receive = cc.instantiate(this.receivePre);
        receive.setPosition(cc.p(0,0));
        this.node.addChild(receive,1);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
