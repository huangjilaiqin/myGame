cc.Class({
    extends: cc.Component,

    properties: {
        
        playerName:{
            default:null,
            type:cc.Label,
        },
        score:{
            default:null,
            type:cc.Label,
        },
    },
    
    init:function(record){
        cc.log(record);
        this.playerName.string=record.username;
        this.score.string=record.score;
    },

    // use this for initialization
    onLoad: function () {

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
