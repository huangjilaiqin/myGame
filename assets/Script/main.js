
const Test = require('Test');
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
        bgAudio:{
            default:null,
            url:cc.AudioClip
        },
    },

    // use this for initialization
    onLoad: function () {
        cc.log(Test);
        var test = new Test();
        test.foo();
        var network = new Network();
        //cc.log(network.getInstance(undefined,undefined,function(){cc.log('getInstance');}));
        cc.log(network.getInstance());
        cc.audioEngine.playMusic(this.bgAudio, true);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    searchOpponent:function(){
        cc.log('searchOpponent');
    },
});
