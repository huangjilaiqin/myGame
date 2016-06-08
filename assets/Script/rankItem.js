cc.Class({
    extends: cc.Component,

    properties: {
        rank:{
            default:null,
            type:cc.Label,
        },
        playerName:{
            default:null,
            type:cc.Label,
        },
        total:{
            default:null,
            type:cc.Label,
        },
    },
    
    init:function(player){
        this.playerName.string=player.name;
        this.rank.string=player.rank;
        this.total.string=player.total;
    },

    // use this for initialization
    onLoad: function () {

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
