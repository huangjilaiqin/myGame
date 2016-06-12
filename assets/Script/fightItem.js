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
        result:{
            default:null,
            type:cc.Label,
        },
    },
    
    init:function(record){
        this.playerName.string=record.opponentName;
        this.score.string=record.score;
        this.result.string=record.result;
    },

    // use this for initialization
    onLoad: function () {

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
