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
        }
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
        
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
