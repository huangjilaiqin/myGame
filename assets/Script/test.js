
const Network = require('Network');

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
        loadingPrefab:{
            default: null,
            type: cc.Prefab
        },
        mytime:{
            default:null,
            type:cc.Sprite,
        },
    },

    // use this for initialization
    onLoad: function () {
        /*
        var broadcast = cc.instantiate(this.broadcastPre);
        broadcast.setPosition(cc.p(0,0));
        this.node.addChild(broadcast,1);
        */
        /*
        //*领取奖励
        var receive = cc.instantiate(this.receivePre);
        receive.setPosition(cc.p(0,0));
        var that = this;
        receive.getComponent('receiveBonus').init(function(){
            var netInstance = Network.getInstance();
            netInstance.emit('getBonus', {'bonusId':1});
            //loading
            var loading = cc.instantiate(that.loadingPrefab);
            //loading.setPosition(cc.p(0,0));
            that.node.addChild(loading,1,3000);
            
            netInstance.listenOn('getBonus',function(){
                that.node.removeChildByTag(3000);
                that.node.removeChildByTag(2000);
            });
        });
        this.node.addChild(receive,1,2000);
        //*/
        this.mynum=0;
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this.mynum+dt>30)
            this.mynum=30;
        else
            this.mynum += dt;
        this.mytime.fillStart = this.mynum/30;
            
    },
});
